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
    public hideturtle = () => {
        this.turtle.setVisible(false);
    }
    public showturtle = () => {
        this.turtle.setVisible(true);
    }
    public home = () => {
        this.turtle.home();
    }
    public penup = () => {
        this.turtle.setPen(false);
    }
    public pendown = () => {
        this.turtle.setPen(true);
    }
    public setpos = (x: number, y: number) => {
        this.turtle.setPosition(x, y);
    }
    public setbc = (color?: string) => {
        if(color) {
            this.turtle.setBackgroundColor(color);
        }
    }
    public setsc = (color?: string) => {
        if(color) {
            console.log(color);
            this.turtle.setStrokeColor(color);
        }        
    }
    public setsw = (weight: number) => {
        this.turtle.setStrokeWeight(weight);               
    }
    public load = (dir: number) => {
        this.turtle.setPen(true);
    }
    public save = (dir: number) => {
        this.turtle.setPen(true);
    }
} 