import type { Turtle } from './turtle';
import type { ICommandModel } from 'src/models';

export class Caller {
    private readonly turtle: Turtle;
    public constructor(turtle: Turtle) {
        this.turtle = turtle;
    }
    public execute = (command: ICommandModel) => {
        switch (command.name) {
            case 'repeat':
                this.repeat(command);
                break;
            case 'setpos':
                if (command.value !== undefined && command.arg2 !== undefined) {
                    this.setpos(command.value, command.arg2);
                }
                break;
            case 'setsc':
                this.setsc(command.color);
                break;
            case 'setbc':
                this.setbc(command.color);
                break;
            case 'fd':
            case 'bk':
            case 'tl':
            case 'tr':
            case 'setsw':
                this[command.name](command.value ?? 0);
                break;
            case 'hideturtle':
            case 'showturtle':
            case 'home':
            case 'penup':
            case 'pendown':
                this[command.name]();
                break;
            case 'load':
                this.load();
                break;
            case 'save':
                this.save();
                break;
            default:
                break;
        }
    }
    public fd = (dist: number) => {
        this.turtle.drawLine(dist);
    }
    public bk = (dist: number) => {
        this.turtle.drawLine(-dist);
    }
    public tl = (dir: number) => {
        this.turtle.rotate(-dir);
    }
    public tr = (dir: number) => {
        this.turtle.rotate(dir);
    }
    public repeat = (command: ICommandModel) => {
        const caller = new Caller(this.turtle);
        if(command.value !== undefined && command.value !== 0) {
            for(let i = 0; i < command.value; i += 1) {
                if(command.commands) {
                    command.commands.forEach((newCommand) => { caller.execute(newCommand); });
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
        if(color !== undefined && color !== '') {
            this.turtle.setBackgroundColor(color);
        }
    }
    public setsc = (color?: string) => {
        if(color !== undefined && color !== '') {
            this.turtle.setStrokeColor(color);
        }        
    }
    public setsw = (weight: number) => {
        this.turtle.setStrokeWeight(weight);               
    }
    public load = () => {
        this.turtle.setPen(true);
    }
    public save = () => {
        this.turtle.setPen(true);
    }
}
