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
        while(array.length > this.index) {
            const cmd = CommandTypes[array[this.index]];
            if(cmd) {
                const command: ICommandModel = {
                    id: Date.now(),
                    name: cmd,
                    value: Number(array[++this.index])                
                }         
                commandArray.push(command);
            } else {
                cb(array[this.index]);
            }
            this.index++;
        }
        
        
        return commandArray;
    }
} 