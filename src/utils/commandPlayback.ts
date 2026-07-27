import type {
  AnimationEasing,
  ICommandAnimation,
  ICommandModel,
} from "src/models";

export const applyEasing = (
  progress: number,
  easing: AnimationEasing,
): number => {
  const safeProgress = Math.min(1, Math.max(0, progress));

  if (easing === "ease-in") {
    return safeProgress ** 2;
  }

  if (easing === "ease-out") {
    return 1 - (1 - safeProgress) ** 2;
  }

  if (easing === "ease-in-out") {
    return safeProgress < 0.5
      ? 2 * safeProgress ** 2
      : 1 - ((-2 * safeProgress + 2) ** 2) / 2;
  }

  return safeProgress;
};

export const getCommandAnimations = (
  command: Readonly<ICommandModel>,
): readonly ICommandAnimation[] => [
  ...(command.animation === undefined ? [] : [command.animation]),
  ...(command.animations ?? []),
];

export const getAnimationDuration = (
  animation: Readonly<ICommandAnimation>,
): number => {
  if (animation.cycles === "infinite") {
    return Number.POSITIVE_INFINITY;
  }

  if (animation.mode === "pingpong") {
    return animation.durationMs * animation.cycles * 2;
  }

  if (animation.mode === "repeat") {
    return animation.durationMs * animation.cycles;
  }

  return animation.durationMs;
};

export const getCommandAnimationDuration = (
  command: Readonly<ICommandModel>,
): number =>
  Math.max(
    0,
    ...getCommandAnimations(command).map(getAnimationDuration),
  );

export const hasInfiniteAnimation = (
  command: Readonly<ICommandModel>,
): boolean =>
  getCommandAnimations(command).some(
    ({ cycles }) => cycles === "infinite",
  );

const getAnimationProgressAtTime = (
  animation: Readonly<ICommandAnimation>,
  elapsedMs: number,
): number => {
  const safeElapsed = Math.max(0, elapsedMs);
  const totalDuration = getAnimationDuration(animation);

  if (animation.mode === "once") {
    return Math.min(1, safeElapsed / animation.durationMs);
  }

  if (
    animation.cycles !== "infinite" &&
    safeElapsed >= totalDuration
  ) {
    return animation.mode === "pingpong" ? 0 : 1;
  }

  const leg = Math.floor(safeElapsed / animation.durationMs);
  const legProgress =
    (safeElapsed % animation.durationMs) / animation.durationMs;
  if (animation.mode === "pingpong" && leg % 2 === 1) {
    return 1 - legProgress;
  }

  return legProgress;
};

const setAnimatedProperty = (
  command: ICommandModel,
  animation: Readonly<ICommandAnimation>,
  value: number,
) => {
  if (animation.property === "value") {
    command.value = value;
  } else if (animation.property === "arg2") {
    command.arg2 = value;
  } else if (animation.property === "width") {
    command.width = value;
    command.value = value;
  } else if (animation.property === "height") {
    command.height = value;
  } else if (animation.property === "depth") {
    command.depth = value;
    command.arg2 = value;
  } else {
    command.rotation = value;
  }
};

export const getAnimatedCommandAtTime = (
  command: Readonly<ICommandModel>,
  elapsedMs: number,
): ICommandModel => {
  const animatedCommand: ICommandModel = { ...command };
  getCommandAnimations(command).forEach((animation) => {
    const progress = getAnimationProgressAtTime(animation, elapsedMs);
    const easedProgress = applyEasing(progress, animation.easing);
    const value =
      animation.start +
      (animation.finish - animation.start) * easedProgress;
    setAnimatedProperty(animatedCommand, animation, value);
  });
  return animatedCommand;
};

export const getFinalAnimatedCommand = (
  command: Readonly<ICommandModel>,
): ICommandModel => {
  const finalCommand: ICommandModel = { ...command };
  getCommandAnimations(command).forEach((animation) => {
    const value =
      animation.mode === "pingpong" &&
      animation.cycles !== "infinite"
        ? animation.start
        : animation.finish;
    setAnimatedProperty(finalCommand, animation, value);
  });
  return finalCommand;
};

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
