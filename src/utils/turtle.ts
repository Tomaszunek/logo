import { Color } from 'csstype';
import logoTurtle from '../logoTurtle.png';

export class Turtle {
    public x: number;
    public y: number;
    public homeX: number;
    public homeY: number;
    public dir: number;

    public strokeColor: Color;
    public strokeWeight: number;
    public pen: boolean;

    public canvas: HTMLCanvasElement | null;
    constructor(turtle: ITurtleInstance) {        
        this.x = turtle.homeX;
        this.y = turtle.homeY;
        this.homeX = turtle.homeX;
        this.homeY = turtle.homeY;
        this.canvas = turtle.canvas;
        this.dir = turtle.dir;
        this.strokeColor = turtle.strokeColor;
        this.strokeWeight = turtle.strokeWeight;
        this.pen = turtle.pen;
    }    

    public drawLine = (x:number, y:number) => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        let newX: number;
        let newY: number;
        if(ctx === null) {return};      
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);        
        newX = x + this.x;
        newY = y + this.y;
        ctx.lineTo(newX, newY);        
        ctx.stroke();
        this.x = newX;
        this.y = newY;
    }

    public drawTurtle = () => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return}; 
        const baseImage = new Image();
        baseImage.src = logoTurtle;
        baseImage.onload = () => {
            ctx.drawImage(baseImage, this.x - 40, this.y - 40); 
        }  
    }

    public rotate = (dir:number) => {
        this.dir = this.dir + dir; 
    }

    public clearCanvas = () => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return}; 
        ctx.clearRect(0, 0, 800, 800);
    }

    public home = () => {
        this.x = this.homeX;
        this.y = this.homeY;
        this.dir = 0;
    }
};

export interface ITurtleInstance {
    canvas:HTMLCanvasElement | null,
    homeX: number,
    homeY: number,
    dir: number,
    strokeColor: Color,
    strokeWeight: number,
    pen: boolean
}