import type { ICommandModel } from "src/models";

export const expandPlaybackCommands = (
  commands: readonly ICommandModel[],
): readonly ICommandModel[] => {
  const expanded: ICommandModel[] = [];

  const appendCommands = (items: readonly ICommandModel[]) => {
    items.forEach((command) => {
      if (command.name !== "repeat") {
        expanded.push(command);
        return;
      }

      const repeatCount = command.value ?? 0;
      if (
        !Number.isSafeInteger(repeatCount) ||
        repeatCount <= 0 ||
        command.commands === undefined
      ) {
        return;
      }

      for (let index = 0; index < repeatCount; index += 1) {
        appendCommands(command.commands);
      }
    });
  };

  appendCommands(commands);
  return expanded;
};
