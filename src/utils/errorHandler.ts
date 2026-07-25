import type { ICommandDescription } from "src/models";

export class ErrorHandler {
  private readonly errorTexts: IErrorText;
  private readonly commandDescription: Readonly<
    Record<string, ICommandDescription>
  >;

  public constructor(
    errorHandlerTexts: IErrorText,
    commandDescription: Readonly<Record<string, ICommandDescription>>,
  ) {
    this.errorTexts = errorHandlerTexts;
    this.commandDescription = commandDescription;
  }

  public handleError(): string {
    const { insideCommand, wrongCommand } = this.errorTexts;
    const position = findDifference(insideCommand, wrongCommand);
    const remaining = insideCommand.slice(position).trimStart();
    const [token = "end of input"] = remaining.split(/\s+/u);
    const knownCommands = Object.keys(this.commandDescription);
    const normalizedToken = token.toLowerCase();
    const contextStart = Math.max(0, position - 14);
    const contextEnd = Math.min(insideCommand.length, position + 22);
    const context = insideCommand.slice(contextStart, contextEnd);

    if (knownCommands.includes(normalizedToken)) {
      return `“${context}”\n${normalizedToken} is missing or has an invalid argument.`;
    }

    if (/^-?(?:\d+\.?\d*|\.\d+)$/u.test(token)) {
      return `“${context}”\nThe number ${token} needs a command before it.`;
    }

    if (token === "end of input") {
      return "The command is incomplete. Check its arguments and closing brackets.";
    }

    return `“${context}”\nUnknown command or invalid value: ${token}.`;
  }
}

export interface IErrorText {
  fullCommand: string;
  insideCommand: string;
  wrongCommand: string;
}

const findDifference = (text: string, parsedText: string): number => {
  const limit = Math.min(text.length, parsedText.length);
  let index = 0;
  while (index < limit && text[index] === parsedText[index]) {
    index += 1;
  }
  return index;
};
