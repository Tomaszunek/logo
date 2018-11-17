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
        const array = this.text.split(' ');
        const commandArray = new Array<ICommandModel>();
        let someErrors:boolean = false;       
        while(array.length > this.index && !someErrors) {
            const cmd = CommandTypes[array[this.index]];            
            if(cmd && array[this.index + 1]) {
                const argCount = this.commandDescriptions[cmd].argCount;
                let command: ICommandModel = {
                    id: 0, value: 0, name
                };
                switch (argCount) {
                    case 0:
                        command = {
                            id: 0,
                            name: cmd
                        }                          
                        break;
                    case 1:
                        command = {
                            id: 0,
                            name: cmd,
                            value: Number(array[++this.index])                
                        }                          
                        break; 
                    case 2:
                        const parser = new Parser(array[this.index + 2], this.commandDescriptions).parse(cb);
                        command = {
                            id: 0,
                            name: cmd,
                            value: Number(array[++this.index]),
                            commands: parser            
                        }                      
                        break; 
                    case 3:
                        command = {
                            id: 0,
                            name: cmd,
                            value: Number(array[++this.index])                
                        }
                        break;               
                    default:
                        break;
                }                       
                commandArray.push(command);
                this.index++;
            } else {
                someErrors = true;                
            }            
        }
        if(!someErrors) {
            return commandArray;
        } else {
            cb(array[this.index]);
            return [];
        }        
        
    }
}
