import { blendModes, type ICommandModel } from "src/models/Command";
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
    }

    if (numberCommands.has(name)) {
      command.value = this.takeNumber();
      return command;
    }

    if (twoNumberCommands.has(name)) {
      command.value = this.takeNumber();
      command.arg2 = this.takeNumber();
      return command;
    }

    if (name === "setsc" || name === "setbc") {
      command.color = this.takeColor();
      return command;
    }

    if (gradientCommands.has(name)) {
      command.color = this.takeColor();
      command.color2 = this.takeColor();
      command.value = this.takeNumber();
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
