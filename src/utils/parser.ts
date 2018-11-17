import { CommandTypes } from 'src/models/CommandTypes';
import { ICommandModel} from 'src/models/Command'

export class Parser {
    public text:string;
    public index: number;
    constructor(text: string) {
        this.text = text;
        this.index = 0;
    }

    public parse(cb: (text: string) => void) {
        const array = this.text.split(' ');
        const commandArray = new Array<ICommandModel>();
        let someErrors:boolean = false;       
        while(array.length > this.index && !someErrors) {
            const cmd = CommandTypes[array[this.index]];
            if(cmd && array[this.index + 1]) {
                const command: ICommandModel = {
                    id: 0,
                    name: cmd,
                    value: Number(array[++this.index])                
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