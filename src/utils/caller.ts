import { Turtle } from './turtle';

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
    public repeat = (commands: number) => {
        const caller = new Caller(this.turtle);        
        return caller;
    }
    public hideTurtle = (dir: number) => {
        return 0;
    }
    public showTurtle = (dir: number) => {
        return 0;
    }
    public penup = (dir: number) => {
        this.turtle.setPen(false);
    }
    public pendown = (dir: number) => {
        this.turtle.setPen(true);
    }
} 