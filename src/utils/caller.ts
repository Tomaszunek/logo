import { Turtle } from './turtle';

export class Caller {
    private turtle: Turtle;
    constructor(turtle: Turtle) {
        this.turtle = turtle;
    }
    public fd = (dist: number) => {
        this.turtle.drawLine(dist, 0);
    }
    public tl = (dir: number) => {
        this.turtle.rotate(dir);
    }
} 