import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ICommandModel, IProcedureDefinition } from "../models";

export interface CommandStore {
  commands: readonly ICommandModel[];
  procedures: readonly IProcedureDefinition[];
  addCommand: (command: Readonly<ICommandModel>) => void;
  defineProcedures: (
    procedures: readonly Readonly<IProcedureDefinition>[],
  ) => void;
  deleteProcedure: (name: string) => void;
  editCommand: (command: Readonly<ICommandModel>) => void;
  deleteCommand: (id: number) => void;
  replaceCommands: (commands: readonly ICommandModel[]) => void;
}

interface IndexedCommands {
  commands: ICommandModel[];
  nextId: number;
}

const cloneCommand = (command: Readonly<ICommandModel>): ICommandModel => ({
  ...command,
  ...(command.animation ? { animation: { ...command.animation } } : {}),
  ...(command.animations
    ? { animations: command.animations.map((animation) => ({ ...animation })) }
    : {}),
  ...(command.palette ? { palette: [...command.palette] } : {}),
  ...(command.commands
    ? { commands: command.commands.map((child) => cloneCommand(child)) }
    : {}),
});

 const assignIds = (
  commands: readonly ICommandModel[],
  startId: number,
): IndexedCommands => {
  let nextId = startId;
  const indexed = commands.map((command) => {
    const id = nextId;
    nextId += 1;
     const children = command.commands
      ? assignIds(command.commands, nextId)
      : undefined;

    if (children) {
      ({ nextId } = children);
    }

    return {
      ...command,
      id,
      ...(children ? { commands: children.commands } : {}),
    };
  });

  return { commands: indexed, nextId };
};

 const getNextId = (commands: readonly ICommandModel[]): number => {
  let highestId = -1;

  const visit = (items: readonly ICommandModel[]) => {
    items.forEach((item) => {
      highestId = Math.max(highestId, item.id);
      if (item.commands) {
        visit(item.commands);
      }
    });
  };

  visit(commands);
  return highestId + 1;
};

 const addToTree = (
  commands: readonly ICommandModel[],
  command: Readonly<ICommandModel>,
): ICommandModel[] => {
  const indexed = assignIds([cloneCommand(command)], getNextId(commands));
  return [...commands.map((item) => cloneCommand(item)), ...indexed.commands];
};

 const editTree = (
  commands: readonly ICommandModel[],
  replacement: Readonly<ICommandModel>,
): ICommandModel[] =>
  commands.map((command) => {
    if (command.id === replacement.id) {
      return cloneCommand({ ...command, ...replacement });
    }

    return command.commands
      ? {
          ...command,
          commands: editTree(command.commands, replacement),
        }
      : cloneCommand(command);
  });

 const deleteFromTree = (
  commands: readonly ICommandModel[],
  id: number,
): ICommandModel[] =>
  commands
    .filter((command) => command.id !== id)
    .map((command) =>
      command.commands
        ? {
            ...command,
            commands: deleteFromTree(command.commands, id),
          }
        : cloneCommand(command),
    );

export const useCommandStore = create<CommandStore>()(
  devtools(
    (set) => ({
      commands: [],
      procedures: [],
      addCommand: (command) =>
        { set(
          (state) => ({ commands: addToTree(state.commands, command) }),
          false,
          "commands/add",
        ); },
      defineProcedures: (definitions) => {
        set(
          (state) => {
            const procedures = [...state.procedures];
            definitions.forEach((definition) => {
              const existingIndex = procedures.findIndex(
                ({ name }) => name === definition.name,
              );
              const clonedDefinition = {
                ...definition,
                parameters: [...definition.parameters],
              };
              if (existingIndex === -1) {
                procedures.push(clonedDefinition);
              } else {
                procedures[existingIndex] = clonedDefinition;
              }
            });
            return { procedures };
          },
          false,
          "procedures/define",
        );
      },
      deleteProcedure: (name) => {
        set(
          (state) => ({
            procedures: state.procedures.filter(
              (procedure) => procedure.name !== name,
            ),
          }),
          false,
          "procedures/delete",
        );
      },
      editCommand: (command) =>
        { set(
          (state) => ({ commands: editTree(state.commands, command) }),
          false,
          "commands/edit",
        ); },
      deleteCommand: (id) =>
        { set(
          (state) => ({ commands: deleteFromTree(state.commands, id) }),
          false,
          "commands/delete",
        ); },
      replaceCommands: (commands) =>
        { set(
          { commands: assignIds(commands, 0).commands },
          false,
          "commands/replace",
        ); },
    }),
    {
      name: "logo-command-store",
      enabled: import.meta.env.DEV,
    },
  ),
);
