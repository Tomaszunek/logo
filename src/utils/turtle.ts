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
    public visible: boolean;

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
        this.visible = turtle.visible;
    }    

    public drawLine = (dist :number) => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        let newX: number;
        let newY: number;
        if(ctx === null) {return};      
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);        
        this.x = newX = this.x + (Math.cos(this.dir) * dist);
        this.y = newY = this.y + (Math.sin(this.dir) * dist);
        ctx.lineTo(newX, newY);        
        ctx.stroke();
        ctx.closePath();
    }

    public drawTurtle = () => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return};
        if(this.visible === false) {return;}
        ctx.save();
        ctx.translate(-12,32);
        ctx.rotate(this.dir * Math.PI/180.0 );
        ctx.translate(12,-32); 
        const baseImage = new Image();
        baseImage.src = logoTurtle;
        baseImage.onload = () => {
            ctx.drawImage(baseImage, this.x + 12, this.y - 32); 
            ctx.restore(); 
        } 
        
    }

    public rotate = (dir:number) => {
        this.dir += dir;
    }

    public clearCanvas = () => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return}; 
        ctx.clearRect(0, 0, 800, 800);
        this.home();
    }

    public setPen = (isDrawing: boolean) => {
        this.pen = isDrawing;
    }

    public setVisible = (isVisible: boolean) => {
        this.visible = isVisible;
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
    pen: boolean,
    visible: boolean
}