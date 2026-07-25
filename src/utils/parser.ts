import type { ICommandModel } from "src/models/Command";
import type { CommandTypes } from "src/models/CommandTypes";

interface Token {
  value: string;
  start: number;
}

const commands = new Set<CommandTypes>([
  "bk",
  "fd",
  "hideturtle",
  "home",
  "pendown",
  "penup",
  "repeat",
  "setbc",
  "setpos",
  "setsc",
  "setsw",
  "showturtle",
  "tl",
  "tr",
]);

const numberCommands = new Set<CommandTypes>([
  "bk",
  "fd",
  "setsw",
  "tl",
  "tr",
]);

const noArgumentCommands = new Set<CommandTypes>([
  "hideturtle",
  "home",
  "pendown",
  "penup",
  "showturtle",
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
        throw new ParseError(this.tokens[this.index]?.start ?? this.text.length);
      }
      return parsed;
    } catch (error: unknown) {
      const position =
        error instanceof ParseError ? error.position : this.text.length;
      onError(this.text, this.text.slice(0, position).trimEnd());
      return [];
    }
  }

  private parseSequence = (insideRepeat: boolean): ICommandModel[] => {
    const parsed: ICommandModel[] = [];

    while (this.index < this.tokens.length) {
      if (this.peek() === "]") {
        if (!insideRepeat) {
          throw new ParseError(this.currentPosition());
        }
        break;
      }
      parsed.push(this.parseCommand());
    }

    return parsed;
  };

  private parseCommand = (): ICommandModel => {
    const commandToken = this.take();
    const normalizedName = commandToken.value.toLowerCase();

    if (!commands.has(normalizedName as CommandTypes)) {
      throw new ParseError(commandToken.start);
    }

    const name = normalizedName as CommandTypes;
    const command: ICommandModel = { id: 0, name };

    if (noArgumentCommands.has(name)) {
      return command;
    }

    if (numberCommands.has(name)) {
      command.value = this.takeNumber();
      return command;
    }

    if (name === "setpos") {
      command.value = this.takeNumber();
      command.arg2 = this.takeNumber();
      return command;
    }

    if (name === "setsc" || name === "setbc") {
      const color = this.take();
      if (!/^#?[0-9a-f]{6}$/iu.test(color.value)) {
        throw new ParseError(color.start);
      }
      command.color = color.value.startsWith("#")
        ? color.value.toLowerCase()
        : `#${color.value.toLowerCase()}`;
      return command;
    }

    const repeatCount = this.takeNumber();
    if (!Number.isInteger(repeatCount) || repeatCount < 0) {
      throw new ParseError(this.previousPosition());
    }
    this.expect("[");
    const nestedCommands = this.parseSequence(true);
    if (nestedCommands.length === 0) {
      throw new ParseError(this.currentPosition());
    }
    this.expect("]");
    command.value = repeatCount;
    command.commands = nestedCommands;
    return command;
  };

  private takeNumber = (): number => {
    const token = this.take();
    const number = Number(token.value);
    if (!Number.isFinite(number)) {
      throw new ParseError(token.start);
    }
    return number;
  };

  private expect = (expected: string) => {
    const token = this.take();
    if (token.value !== expected) {
      throw new ParseError(token.start);
    }
  };

  private take = (): Token => {
    const token = this.tokens[this.index];
    if (token === undefined) {
      throw new ParseError(this.text.length);
    }
    this.index += 1;
    return token;
  };

  private peek = (): string | undefined => this.tokens[this.index]?.value;

  private currentPosition = (): number =>
    this.tokens[this.index]?.start ?? this.text.length;

  private previousPosition = (): number =>
    this.tokens[Math.max(0, this.index - 1)]?.start ?? this.text.length;
}

class ParseError extends Error {
  public constructor(public readonly position: number) {
    super("Invalid Logo command");
  }
}
