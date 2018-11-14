

export class Turtle {
    public turtle: ITurtleInstance;
    constructor(turtle: ITurtleInstance) {        
        this.turtle = turtle;
    }

    public drawLine = (canvas:HTMLCanvasElement, x:number, y:number) => {
        const ctx = canvas.getContext("2d");
        let newX: number;
        let newY: number;
        if(ctx === null) {return};      
        ctx.beginPath();
        ctx.moveTo(this.turtle.currentX, this.turtle.currentY);
        
        newX = x + this.turtle.currentX;
        newY = y + this.turtle.currentY;
        ctx.lineTo(newX, newY);        
        ctx.stroke();
        this.turtle.currentX = newX;
        this.turtle.currentY = newY;
    }
};

export interface ITurtleInstance {
    currentX: number,
    currentY: number
}