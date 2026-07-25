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
    return getPrimitiveCost(command);
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

type CostCalculator = (command: Readonly<ICommandModel>) => number;

const clampInteger = (value: number | undefined, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, Math.round(Math.abs(value ?? minimum))));

const primitiveCosts: Readonly<
  Partial<Record<ICommandModel["name"], CostCalculator>>
> = {
  cube: () => 14,
  fillpoly: (command) => clampInteger(command.value, 3, 360) + 2,
  grid3d: (command) => clampInteger(command.arg2, 2, 64) * 2 + 2,
  polygon: (command) => clampInteger(command.value, 3, 360) + 2,
  sphere: (command) => clampInteger(command.arg2, 2, 32) * 2 + 2,
  spiral: (command) =>
    Math.max(12, Math.ceil(Math.min(100, Math.abs(command.value ?? 0)) * 72)) +
    2,
  star: (command) => clampInteger(command.value, 3, 180) * 2 + 2,
};

const getPrimitiveCost = (command: Readonly<ICommandModel>): number =>
  primitiveCosts[command.name]?.(command) ?? 1;
