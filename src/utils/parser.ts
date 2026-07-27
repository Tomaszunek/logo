import {
  animationEasings,
  animationModes,
  blendModes,
  type AnimationCycles,
  type AnimationProperty,
  type ICommandAnimation,
  type ICommandModel,
} from "src/models/Command";
import type { CommandTypes } from "src/models/CommandTypes";

interface Token {
  value: string;
  start: number;
}

interface ParserError extends Error {
  position: number;
}

const commandByName: Readonly<Partial<Record<string, CommandTypes>>> = {
  arc: "arc",
  back: "bk",
  backward: "bk",
  bk: "bk",
  circle: "circle",
  cube: "cube",
  dot: "dot",
  ellipse: "ellipse",
  fd: "fd",
  fillpoly: "fillpoly",
  forward: "fd",
  gradientbg: "gradientbg",
  grid3d: "grid3d",
  hideturtle: "hideturtle",
  home: "home",
  left: "tl",
  lt: "tl",
  pendown: "pendown",
  penup: "penup",
  polygon: "polygon",
  pop: "pop",
  push: "push",
  repeat: "repeat",
  right: "tr",
  rt: "tr",
  setalpha: "setalpha",
  setbc: "setbc",
  setblend: "setblend",
  setdash: "setdash",
  setflow: "setflow",
  setglow: "setglow",
  setgradient: "setgradient",
  seth: "seth",
  setheading: "seth",
  setpalette: "setpalette",
  setpos: "setpos",
  setradial: "setradial",
  setsc: "setsc",
  setseed: "setseed",
  setsoftness: "setsoftness",
  setsw: "setsw",
  setsymmetry: "setsymmetry",
  setxy: "setpos",
  showturtle: "showturtle",
  sphere: "sphere",
  spiral: "spiral",
  spray: "spray",
  star: "star",
  tl: "tl",
  tr: "tr",
};

const numberCommands = new Set<CommandTypes>([
  "bk",
  "fd",
  "circle",
  "dot",
  "setalpha",
  "setflow",
  "setglow",
  "seth",
  "setseed",
  "setsoftness",
  "setsymmetry",
  "setsw",
  "tl",
  "tr",
]);

const noArgumentCommands = new Set<CommandTypes>([
  "hideturtle",
  "home",
  "pendown",
  "penup",
  "pop",
  "push",
  "showturtle",
]);

const twoNumberCommands = new Set<CommandTypes>([
  "arc",
  "cube",
  "ellipse",
  "fillpoly",
  "grid3d",
  "polygon",
  "setdash",
  "setpos",
  "sphere",
  "spray",
  "spiral",
  "star",
]);

const gradientCommands = new Set<CommandTypes>([
  "gradientbg",
  "setgradient",
  "setradial",
]);

const cubeProperties: Readonly<Record<string, AnimationProperty>> = {
  depth: "depth",
  height: "height",
  rotation: "rotation",
  width: "width",
};

const getCubeProperty = (
  value: string | undefined,
): AnimationProperty | undefined =>
  value === undefined ? undefined : cubeProperties[value.toLowerCase()];

const setCubeProperty = (
  command: ICommandModel,
  property: AnimationProperty,
  value: number,
) => {
  if (property === "width") {
    command.width = value;
    return;
  }
  if (property === "height") {
    command.height = value;
    return;
  }
  if (property === "depth") {
    command.depth = value;
    return;
  }
  if (property === "rotation") {
    command.rotation = value;
  }
};

const tokenize = (text: string): Token[] => {
  const result: Token[] = [];
  const matcher = /\[|\]|[^\s[\]]+/gu;
  let match = matcher.exec(text);

  while (match !== null) {
    result.push({ value: match[0], start: match.index });
    match = matcher.exec(text);
  }

  return result;
};

const parseError = (position: number): ParserError =>
  Object.assign(new Error("Invalid Logo command"), { position });

const isParserError = (error: unknown): error is ParserError =>
  error instanceof Error &&
  "position" in error &&
  typeof error.position === "number";

export class Parser {
  public text: string;
  public index: number;
  private readonly tokens: Token[];

  public constructor(text: string) {
    this.text = text;
    this.index = 0;
    this.tokens = tokenize(text);
  }

  public parse(onError: (text: string, parsedText: string) => void): ICommandModel[] {
    try {
      const parsed = this.parseSequence(false);
      if (this.index !== this.tokens.length) {
        throw parseError(this.tokens[this.index].start);
      }
      return parsed;
    } catch (error: unknown) {
      const position =
        isParserError(error) ? error.position : this.text.length;
      onError(this.text, this.text.slice(0, position).trimEnd());
      return [];
    }
  }

  private readonly parseSequence = (insideRepeat: boolean): ICommandModel[] => {
    const parsed: ICommandModel[] = [];

    while (this.index < this.tokens.length) {
      if (this.peek() === "]") {
        if (!insideRepeat) {
          throw parseError(this.currentPosition());
        }
        break;
      }
      parsed.push(this.parseCommand());
    }

    return parsed;
  };

  private readonly parseCommand = (): ICommandModel => {
    const commandToken = this.take();
    const normalizedName = commandToken.value.toLowerCase();
    const name = commandByName[normalizedName];
    if (name === undefined) {
      throw parseError(commandToken.start);
    }
    const command: ICommandModel = { id: 0, name };

    if (noArgumentCommands.has(name)) {
      return command;
    }

    if (name === "setblend") {
      const blendToken = this.take();
      const blend = blendModes.find(
        (candidate) => candidate === blendToken.value.toLowerCase(),
      );
      if (blend === undefined) {
        throw parseError(blendToken.start);
      }
      command.blend = blend;
      return command;
    }

    if (name === "setpalette") {
      return this.parsePalette(command);
    }

    if (name === "cube") {
      return this.parseCube(command);
    }

    if (numberCommands.has(name)) {
      this.parseSingleNumber(command);
      return command;
    }

    if (twoNumberCommands.has(name)) {
      this.parseNumberPair(command);
      return command;
    }

    if (name === "setsc" || name === "setbc") {
      command.color = this.takeColor();
      return command;
    }

    if (gradientCommands.has(name)) {
      command.color = this.takeColor();
      command.color2 = this.takeColor();
      this.parseSingleNumber(command);
      return command;
    }

    const repeatCount = this.takeNumber();
    if (!Number.isInteger(repeatCount) || repeatCount < 0) {
      throw parseError(this.previousPosition());
    }
    this.expect("[");
    const nestedCommands = this.parseSequence(true);
    if (nestedCommands.length === 0) {
      throw parseError(this.currentPosition());
    }
    this.expect("]");
    command.value = repeatCount;
    command.commands = nestedCommands;
    return command;
  };

  private readonly parseSingleNumber = (
    command: ICommandModel,
  ) => {
    if (this.hasAnimationModifier()) {
      const animation = this.parseAnimation("value");
      command.animation = animation;
      command.value = animation.finish;
      return;
    }

    command.value = this.takeNumber();
  };

  private readonly parseNumberPair = (
    command: ICommandModel,
  ) => {
    const animations: ICommandAnimation[] = [];
    if (this.hasAnimationModifier()) {
      const animation = this.parseAnimation("value");
      command.value = animation.finish;
      animations.push(animation);
    } else {
      command.value = this.takeNumber();
    }

    if (this.hasAnimationModifier()) {
      const animation = this.parseAnimation("arg2");
      command.arg2 = animation.finish;
      animations.push(animation);
    } else {
      command.arg2 = this.takeNumber();
    }

    if (animations.length > 0) {
      command.animations = animations;
    }
  };

  private readonly parsePalette = (
    command: ICommandModel,
  ): ICommandModel => {
    const colors: string[] = [];
    while (
      this.peek() !== undefined &&
      this.peek() !== "]" &&
      commandByName[this.peek()?.toLowerCase() ?? ""] === undefined
    ) {
      colors.push(this.takeColor());
    }
    if (colors.length === 0) {
      throw parseError(this.currentPosition());
    }
    command.palette = colors;
    return command;
  };

  private readonly parseCube = (
    command: ICommandModel,
  ): ICommandModel => {
    if (this.hasAnimationModifier()) {
      command.value = 220;
      command.width = 220;
      command.height = 220;
      command.arg2 = 90;
      command.depth = 90;
      const animation = this.parseAnimation("rotation");
      command.animation = animation;
      command.rotation = animation.finish;
      return command;
    }

    if (getCubeProperty(this.peek()) !== undefined) {
      return this.parseCubeProperties(command);
    }

    command.value = this.takeNumber();
    command.width = command.value;
    command.height = command.value;
    command.arg2 = this.takeNumber();
    command.depth = command.arg2;

    if (this.hasAnimationModifier()) {
      const animation = this.parseAnimation("rotation");
      command.animation = animation;
      command.rotation = animation.finish;
    }
    return command;
  };

  private readonly parseCubeProperties = (
    command: ICommandModel,
  ): ICommandModel => {
    command.width = 220;
    command.height = 220;
    command.depth = 90;
    command.rotation = 0;
    const animations: ICommandAnimation[] = [];

    let property = getCubeProperty(this.peek());
    while (property !== undefined) {
      this.take();
      if (this.hasAnimationModifier()) {
        const animation = this.parseAnimation(property);
        animations.push(animation);
        setCubeProperty(command, property, animation.finish);
      } else {
        setCubeProperty(command, property, this.takeNumber());
      }
      property = getCubeProperty(this.peek());
    }

    command.value = command.width;
    command.arg2 = command.depth;
    if (animations.length > 0) {
      command.animations = animations;
    }
    return command;
  };

  private readonly parseAnimation = (
    property: AnimationProperty,
  ): ICommandAnimation => {
    this.take();
    this.expect("[");
    const start = this.takeNumber();
    const finish = this.takeNumber();
    const durationMs = this.takeNumber();
    if (durationMs <= 0) {
      throw parseError(this.previousPosition());
    }

    const easingToken = this.take();
    const easing = animationEasings.find(
      (candidate) => candidate === easingToken.value.toLowerCase(),
    );
    if (easing === undefined) {
      throw parseError(easingToken.start);
    }

    let mode: ICommandAnimation["mode"] = "once";
    let cycles: AnimationCycles = 1;
    if (this.peek() !== "]") {
      const modeToken = this.take();
      const parsedMode = animationModes.find(
        (candidate) => candidate === modeToken.value.toLowerCase(),
      );
      if (parsedMode === undefined) {
        throw parseError(modeToken.start);
      }
      mode = parsedMode;
      const cyclesToken = this.take();
      if (cyclesToken.value.toLowerCase() === "infinite") {
        cycles = "infinite";
      } else {
        const parsedCycles = Number(cyclesToken.value);
        if (!Number.isSafeInteger(parsedCycles) || parsedCycles < 1) {
          throw parseError(cyclesToken.start);
        }
        cycles = parsedCycles;
      }
    }
    this.expect("]");

    return {
      cycles,
      durationMs,
      easing,
      finish,
      mode,
      property,
      start,
    };
  };

  private readonly hasAnimationModifier = (): boolean =>
    this.peek()?.toLowerCase() === "anim";

  private readonly takeNumber = (): number => {
    const token = this.take();
    const number = Number(token.value);
    if (!Number.isFinite(number)) {
      throw parseError(token.start);
    }
    return number;
  };

  private readonly takeColor = (): string => {
    const color = this.take();
    if (!/^#?[0-9a-f]{6}$/iu.test(color.value)) {
      throw parseError(color.start);
    }
    return color.value.startsWith("#")
      ? color.value.toLowerCase()
      : `#${color.value.toLowerCase()}`;
  };

  private readonly expect = (expected: string) => {
    const token = this.take();
    if (token.value !== expected) {
      throw parseError(token.start);
    }
  };

  private readonly take = (): Token => {
    if (this.index >= this.tokens.length) {
      throw parseError(this.text.length);
    }
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  };

  private readonly peek = (): string | undefined =>
    this.index < this.tokens.length
      ? this.tokens[this.index].value
      : undefined;

  private readonly currentPosition = (): number =>
    this.index < this.tokens.length
      ? this.tokens[this.index].start
      : this.text.length;

  private readonly previousPosition = (): number =>
    this.tokens[Math.max(0, this.index - 1)].start;
}
