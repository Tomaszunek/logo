import { Turtle } from './turtle';
import { ICommandModel } from 'src/models';

export class Caller {
    private turtle: Turtle;
    constructor(turtle: Turtle) {
        this.turtle = turtle;
    }
    public fd = (dist: number) => {
        this.turtle.drawLine(dist);
    }
    public bk = (dist: number) => {
        this.turtle.drawLine(-dist);
    }
    public tl = (dir: number) => {
        this.turtle.rotate(dir);
    }
    public tr = (dir: number) => {
        this.turtle.rotate(-dir);
    }
    public repeat = (command: ICommandModel) => {
        const caller = new Caller(this.turtle);
        if(command && command.value) {
            for(let i = 0; i <= command.value; i++) {
                if(command.commands) {
                    command.commands.forEach(newCommand => {
                        if(newCommand.name === 'repeat' && newCommand.commands) {
                            caller[newCommand.name](newCommand)
                        } else {
                            caller[newCommand.name](newCommand.value);
                        }
                    });
                }
            }
        }
        return caller;
    }
    public hideturtle = (dir: number) => {
        return 0;
    }
    public showturtle = (dir: number) => {
        return 0;
    }
    public home = (dir: number) => {
        return 0;
    }
    public penup = (dir: number) => {
        this.turtle.setPen(false);
    }
    public pendown = (dir: number) => {
        this.turtle.setPen(true);
    }
    public setpos = (dir: number) => {
        this.turtle.setPen(true);
    }
    public setbc = (dir: number) => {
        this.turtle.setPen(true);
    }
    public setpc = (dir: number) => {
        this.turtle.setPen(true);
    }
    public load = (dir: number) => {
        this.turtle.setPen(true);
    }
    public save = (dir: number) => {
        this.turtle.setPen(true);
    }
} 