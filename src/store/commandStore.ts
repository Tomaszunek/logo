import { create } from 'zustand';
import { ICommandModel } from '../models';

// Helper functions replicate reducer logic
const findMostInsideRepeat = (commands: Array<ICommandModel>): number => {
  let lastRepeatIndexCommand = 0;
  for (const command of commands) {
    lastRepeatIndexCommand = command.id;
    if (command.commands) {
      lastRepeatIndexCommand = findMostInsideRepeat(command.commands);
    }
  }
  // Ensure we return a valid id; if no commands, default to 0
  const fallback = commands.length > 0 ? commands[commands.length - 1].id : 0;
  return (lastRepeatIndexCommand || fallback) + 1;
};

const indexsizeRepeat = (
  commands: Array<ICommandModel> | undefined,
  lastIndex: number
): Array<ICommandModel> => {
  let index = lastIndex;
  if (commands) {
    for (const command of commands) {
      command.id = index;
      if (command.commands) {
        command.commands = indexsizeRepeat(command.commands, ++index);
      }
      index++;
    }
  }
  return commands as Array<ICommandModel>;
};

const findElementById = (
  commands: Array<ICommandModel>,
  newCommand: ICommandModel
): Array<ICommandModel> => {
  return commands.map((cmd) => {
    if (cmd && cmd.id === newCommand.id) {
      if (cmd.commands) {
        cmd.commands = findElementById(cmd.commands, newCommand);
      }
      return { ...cmd, ...newCommand };
    }
    return cmd;
  });
};

const filterToDelete = (
  commands: Array<ICommandModel>,
  ind: number
): Array<ICommandModel> => {
  return commands.filter((command) => {
    if (command.id !== ind) {
      if (command.commands) {
        command.commands = filterToDelete(command.commands, ind);
      }
      return true;
    }
    return false;
  });
};

interface CommandState {
  commands: Array<ICommandModel>;
  addCommand: (item: ICommandModel) => void;
  deleteCommand: (id: number) => void;
  editCommand: (item: ICommandModel) => void;
  replaceCommands: (commands: Array<ICommandModel>) => void;
}

export const useCommandStore = create<CommandState>((set, get) => ({
  commands: [],
  addCommand: (item) => {
    const currentCommands = get().commands;
    let id = 0;
    if (!currentCommands.length) {
      id = 0;
    } else {
      const lastCommand = currentCommands[currentCommands.length - 1];
      if (lastCommand.commands) {
        id = findMostInsideRepeat(lastCommand.commands);
      } else {
        id = lastCommand.id + 1;
      }
    }
    if (item) {
      if (item.commands) {
        item.id = id;
        item.commands = indexsizeRepeat(item.commands, ++id);
        set((state) => ({
          commands: [...state.commands, { ...item }],
        }));
      } else {
        set((state) => ({
          commands: [...state.commands, { ...item, id }],
        }));
      }
    }
  },
  deleteCommand: (id) => {
    const currentCommands = get().commands;
    const newCommands = filterToDelete(currentCommands, id);
    set({ commands: newCommands });
  },
  editCommand: (item) => {
    const currentCommands = get().commands;
    const updated = findElementById(currentCommands, item);
    set({ commands: updated });
  },
  replaceCommands: (commands: Array<ICommandModel>) => {
    set({ commands });
  },
}));
