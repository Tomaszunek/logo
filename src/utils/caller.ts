import { Turtle } from './turtle';

export class Caller {
    private turtle: Turtle;
    constructor(turtle: Turtle) {
        this.turtle = turtle;
    }
    public fd = (dist: number) => {
        console.log("fd")
        this.turtle.drawLine(dist, 0);
    }
    public tl = (dir: number) => {
        console.log("tl")
        this.turtle.rotate(dir);
    }
} 