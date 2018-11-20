export class ErrorHandler {
    private errorTexts: IErrorText;
    private commandDescription: any;
    constructor(errorHandlerTexts: IErrorText, commandDescription: any) {        
       this.errorTexts = errorHandlerTexts;
       this.commandDescription = commandDescription;
    }

    public handleError(): string {
        const { fullCommand, insideCommand, wrongCommand } = this.errorTexts;
        const diff = findIndexDiffrenceInStrings(insideCommand, wrongCommand);
        const allCommands = Object.keys(this.commandDescription);
        const wrongElement = insideCommand.slice(diff).split(' ')[0];
        const indexOfStarting = fullCommand.indexOf(insideCommand) + diff;
        const constDisplayerText = fullCommand.slice(indexOfStarting - 10, indexOfStarting + 10).replace(wrongElement, ' |[' + wrongElement +  ' ]|') + '\n'
        if(!isNaN(Number(wrongElement))) {
            return constDisplayerText +  ' Command Error: Argument need command before call.';
        } else if(allCommands.indexOf(wrongElement) >= 0) {
            return constDisplayerText +  ' Argument Error: Command need argument after call.';
        } else {
            return constDisplayerText +  ' No command Error: We dont know your command. Sorry.';
        }        
    }
};

export interface IErrorText {
    fullCommand: string
    insideCommand: string,
    wrongCommand: string    
}

function findIndexDiffrenceInStrings(text1: string, text2: string) {
    const longerLength = Math.max(text1.length, text2.length);
    for (let i = 0; i < longerLength; i++)
    {
        if (text1[i] !== text2[i]) {
            return i;
        }
    }
    return -1;
}