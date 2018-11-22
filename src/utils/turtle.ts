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
    public strokeWeightHome: number;
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
        this.strokeWeightHome = turtle.strokeWeight;
        this.pen = turtle.pen;
        this.visible = turtle.visible;
    }    

    public drawLine = (dist :number) => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        let newX: number;
        let newY: number;
        if(ctx === null) {return};
        newX = this.x + (Math.cos(this.dir * Math.PI / 180) * dist);
        newY = this.y + (Math.sin(this.dir * Math.PI / 180) * dist);
        if(this.pen) {
            console.log(this.strokeWeight);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(newX, newY);
            ctx.lineWidth = this.strokeWeight;
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
            ctx.closePath();
        } else {
            ctx.moveTo(newX, newY);
        }
        this.x = newX;
        this.y = newY;
        
    }

    public drawTurtle = () => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return};
        if(this.visible === false) {return;}
        const baseImage = new Image();
        baseImage.src = logoTurtle;  
        ctx.save();
        this.drawImageCenter(baseImage, this.x, this.y, 12, 16, 1, this.dir * Math.PI / 180 + Math.PI/2)
    }

    public rotate = (dir:number) => {
        this.dir += dir;
    }

    public clearCanvas = () => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return}; 
        ctx.clearRect(0, 0, this.homeX * 2, this.homeY * 2);
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
        this.strokeWeight = this.strokeWeightHome;
    }

    public setPosition = (x: number, y: number) => {
        this.x = x;
        this.y = y;
    }

    public setBackgroundColor = (color: string) => {
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return}; 
        ctx.fillStyle = '#' + color;
        ctx.fillRect(0, 0, this.homeX * 2, this.homeY * 2);
    }

    public setStrokeColor = (color: string) => {
        console.log(color);
        this.strokeColor = '#' + color;
    }

    public setStrokeWeight = (weight: number) => {
        this.strokeWeight = weight;
    }


    // no need to use save and restore between calls as it sets the transform rather 
    // than multiply it like ctx.rotate ctx.translate ctx.scale and ctx.transform
    // Also combining the scale and origin into the one call makes it quicker
    // x,y position of image center
    // cx,cy position of image center rotation
    // scale scale of image
    // rotation in radians.
    public drawImageCenter(image: HTMLImageElement, x:number, y:number, cx:number, cy:number, scale:number, rotation:number){
        if(this.canvas === null) {return};    
        const ctx = this.canvas.getContext("2d");
        if(ctx === null) {return}; 
        ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        ctx.rotate(rotation);
        image.onload = () => {
            ctx.drawImage(image, -cx, -cy); 
            ctx.restore(); 
        }  
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