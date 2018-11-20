import { CommandTypes } from 'src/models/CommandTypes';
import { ICommandModel} from 'src/models/Command'

export class Parser {
    public text:string;
    public index: number;
    public commandDescriptions: any;
    constructor(text: string, cmdDesc: any) {
        this.text = text;
        this.index = 0;
        this.commandDescriptions = cmdDesc;
    }

    public parse(cb: (text: string) => void) {
        const commandArray = new Array<ICommandModel>();
        const repeat = new RegExp(/(repeat [0-9]+ \[.+\])/ig);
        const movingArg = new RegExp(/((fd|bk|tl|tr) [0-9]+)/ig);
        const twoArg = new RegExp(/(setpos [0-9]+ [0-9]+)/ig);
        const saveLoad = new RegExp(/((save|load) [a-z]{2,})/ig);
        const colorArg = new RegExp(/((setpc|setbc) [0-9,a-f]{6})/ig);
        const noArg = new RegExp(/(hideturtle|showturtle|penup|pendown|home)/ig);
        const finalRe = new RegExp(repeat.source + "|" + movingArg.source + "|" + twoArg.source + "|" + saveLoad.source + "|" + colorArg.source + "|" + noArg.source, "ig");
        const regexArray = this.text.match(finalRe);        
        if(regexArray && regexArray.join(' ').length === this.text.length) {
            for(const command of regexArray) {
                const commandElem : ICommandModel = {id: 0, name: CommandTypes.fd};
                if(repeat.test(command)){
                    const sob = command.indexOf('[');
                    const firstPart = command.slice(0, sob - 1).split(' ');
                    const secondPart = command.slice(sob + 1, command.length - 2);                    
                    commandElem.name = CommandTypes.repeat;
                    commandElem.value = firstPart[1];
                    commandElem.commands = new Parser(secondPart, this.commandDescriptions).parse(cb);
                } else if(command.match(movingArg)) {
                    const commandArr = command.split(' ');
                    commandElem.name = CommandTypes[commandArr[0]];
                    commandElem.value = Number(commandArr[1]);
                } else if(command.match(saveLoad) || command.match(colorArg)) {
                    const commandArr = command.split(' ');
                    commandElem.name = CommandTypes[commandArr[0]];
                    commandElem.value = commandArr[1];
                } else if(twoArg.test(command)){
                    const commandArr = command.split(' ');
                    commandElem.name = CommandTypes[commandArr[0]];
                    commandElem.value = Number(commandArr[1]);
                    commandElem.arg2 = Number(commandArr[2]);
                } else {
                    commandElem.name = CommandTypes[command];
                }
                commandArray.push(commandElem);
            }
        } else {
            cb("abba");
        }    

        return commandArray;
    }
}
