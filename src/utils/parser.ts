import type { ICommandModel } from "src/models/Command";
import type { CommandTypes } from "src/models/CommandTypes";

const isCommandType = (
  value: string | undefined,
): value is CommandTypes => {
  switch (value) {
    case "bk":
    case "fd":
    case "hideturtle":
    case "home":
    case "load":
    case "pendown":
    case "penup":
    case "repeat":
    case "save":
    case "setbc":
    case "setpos":
    case "setsc":
    case "setsw":
    case "showturtle":
    case "tl":
    case "tr":
      return true;
    case undefined:
      return false;
    default:
      return false;
  }
};

export class Parser {
  public text: string;
  public index: number;

  public constructor(text: string) {
    this.text = text;
    this.index = 0;
  }

  public parse(cb: (text: string, text2: string) => void): ICommandModel[] {
    const commandArray: ICommandModel[] = [];
    const repeat = /repeat [0-9]+ \[.+\]/iu;
    const movingArg = /(?:fd|bk|tl|tr|setsw) [0-9]+/iu;
    const twoArg = /setpos [0-9]+ [0-9]+/iu;
    const saveLoad = /(?:save|load) [a-z]{2,}/iu;
    const colorArg = /(?:setsc|setbc) [0-9a-f]{6}/iu;
    const noArg = /(?:hideturtle|showturtle|penup|pendown|home)/iu;
    const finalRe = new RegExp(
      [
        repeat.source,
        movingArg.source,
        twoArg.source,
        saveLoad.source,
        colorArg.source,
        noArg.source,
      ].join("|"),
      "giu",
    );
    const regexArray = this.text.match(finalRe);
    const matchedText = regexArray?.join(" ");

    if (regexArray === null || matchedText?.length !== this.text.length) {
      cb(this.text, matchedText ?? "");
      return commandArray;
    }

    for (const command of regexArray) {
      const commandParts = command.split(" ");
      const [commandName] = commandParts;

      if (!isCommandType(commandName)) {
        cb(this.text, matchedText);
        return [];
      }

      let commandElement: ICommandModel = { id: 0, name: commandName };

      if (repeat.test(command)) {
        const openingBracket = command.indexOf("[");
        const firstPart = command.slice(0, openingBracket - 1).split(" ");
        const secondPart = command.slice(openingBracket + 1, command.length - 1);
        const nestedCommands = new Parser(secondPart).parse(cb);

        if (nestedCommands.length === 0) {
          return [];
        }

        commandElement = {
          ...commandElement,
          commands: nestedCommands,
          value: Number(firstPart[1]),
        };
      } else if (movingArg.test(command)) {
        commandElement = {
          ...commandElement,
          value: Number(commandParts[1]),
        };
      } else if (saveLoad.test(command)) {
        commandElement = {
          ...commandElement,
          filename: commandParts[1],
        };
      } else if (colorArg.test(command)) {
        commandElement = {
          ...commandElement,
          color: `#${commandParts[1]}`,
        };
      } else if (twoArg.test(command)) {
        commandElement = {
          ...commandElement,
          arg2: Number(commandParts[2]),
          value: Number(commandParts[1]),
        };
      }

      commandArray.push(commandElement);
    }

    return commandArray;
  }
}
