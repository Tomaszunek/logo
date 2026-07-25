import type { ICommandModel } from "src/models";

// The heaviest bundled gallery example currently executes 638,201 commands.
// Keep a small margin for authored designs while rejecting million-step trees.
export const MAX_COMMAND_OPERATIONS = 750_000;

export interface CommandComplexity {
  operations: number;
  exceedsLimit: boolean;
}

export const getCommandComplexity = (
  commands: readonly ICommandModel[],
  limit = MAX_COMMAND_OPERATIONS,
): CommandComplexity => {
  const safeLimit = Math.max(0, Math.floor(limit));
  let operations = 0;

  for (const command of commands) {
    const available = safeLimit - operations;
    const cost = getCommandCost(command, available);
    operations += cost;

    if (operations > safeLimit) {
      return { operations: safeLimit + 1, exceedsLimit: true };
    }
  }

  return { operations, exceedsLimit: false };
};

const getCommandCost = (
  command: Readonly<ICommandModel>,
  limit: number,
): number => {
  if (command.name !== "repeat") {
    return 1;
  }

  const repeatCount = command.value ?? 0;
  if (
    !Number.isSafeInteger(repeatCount) ||
    repeatCount < 0 ||
    command.commands === undefined
  ) {
    return limit + 1;
  }

  let blockCost = 0;
  for (const child of command.commands) {
    blockCost += getCommandCost(child, limit - blockCost);
    if (blockCost > limit) {
      return limit + 1;
    }
  }

  if (repeatCount === 0 || blockCost === 0) {
    return 1;
  }

  if (repeatCount > Math.floor((limit - 1) / blockCost)) {
    return limit + 1;
  }

  return 1 + repeatCount * blockCost;
};
