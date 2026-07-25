import type { ICommandDescription } from 'src/models';

export class ErrorHandler {
    private readonly errorTexts: IErrorText;
    private readonly commandDescription: Readonly<Record<string, ICommandDescription>>;
    public constructor(
        errorHandlerTexts: IErrorText,
        commandDescription: Readonly<Record<string, ICommandDescription>>,
    ) {
       this.errorTexts = errorHandlerTexts;
       this.commandDescription = commandDescription;
    }

    public handleError(): string {
        const { fullCommand, insideCommand, wrongCommand } = this.errorTexts;
         const diff = findIndexDiffrenceInStrings(insideCommand, wrongCommand);
         const allCommands = Object.keys(this.commandDescription);
         const [wrongElement] = insideCommand.slice(diff).split(' ');
         const indexOfStarting = fullCommand.indexOf(insideCommand) + diff;
         const constDisplayerText = `${fullCommand.slice(indexOfStarting - 10, indexOfStarting + 10).replace(wrongElement, ` |[${  wrongElement   } ]|`)  }\n`
        if(!isNaN(Number(wrongElement))) {
            return `${constDisplayerText   } Command Error: Argument need command before call.`;
        } else if(allCommands.includes(wrongElement)) {
            return `${constDisplayerText   } Argument Error: Command need argument after call.`;
        }
            return `${constDisplayerText   } No command Error: We dont know your command. Sorry.`;

    }
};

export interface IErrorText {
    fullCommand: string
    insideCommand: string,
    wrongCommand: string    
}

const findIndexDiffrenceInStrings = (text1: string, text2: string) => {
    const longerLength = Math.max(text1.length, text2.length);
    for (let i = 0; i < longerLength; i += 1)
    {
        if (text1[i] !== text2[i]) {
            return i;
        }
    }
    return -1;
};
