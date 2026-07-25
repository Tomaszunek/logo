import logoTurtle from "../logoTurtle.png";

export class Turtle {
  public x: number;
  public y: number;
  public homeX: number;
  public homeY: number;
  public dir: number;

  public strokeColor: string;
  public strokeWeight: number;
  public strokeWeightHome: number;
  public pen: boolean;
  public visible: boolean;

  public canvas: HTMLCanvasElement | null;
  private readonly initialStrokeColor: string;
  private readonly initialPen: boolean;
  private readonly initialVisibility: boolean;
  private currentImage: HTMLImageElement | null = null;
  private imageRequest = 0;
  private frameActive = false;
  private pendingStroke = false;

  public constructor(turtle: ITurtleInstance) {
    this.x = turtle.homeX;
    this.y = turtle.homeY;
    this.homeX = turtle.homeX;
    this.homeY = turtle.homeY;
    this.canvas = turtle.canvas;
    this.dir = turtle.dir;
    this.strokeColor = turtle.strokeColor;
    this.initialStrokeColor = turtle.strokeColor;
    this.strokeWeight = turtle.strokeWeight;
    this.strokeWeightHome = turtle.strokeWeight;
    this.pen = turtle.pen;
    this.initialPen = turtle.pen;
    this.visible = turtle.visible;
    this.initialVisibility = turtle.visible;
  }

  public drawLine = (distance: number) => {
    if (this.canvas === null) {
      return;
    }

    const context = this.canvas.getContext("2d");
    if (context === null) {
      return;
    }

    const radians = (this.dir * Math.PI) / 180;
    const newX = this.x + Math.cos(radians) * distance;
    const newY = this.y + Math.sin(radians) * distance;

    if (this.pen) {
      if (!this.frameActive || !this.pendingStroke) {
        context.beginPath();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = this.strokeWeight;
        context.strokeStyle = this.strokeColor;
      }
      context.moveTo(this.x, this.y);
      context.lineTo(newX, newY);
      if (this.frameActive) {
        this.pendingStroke = true;
      } else {
        context.stroke();
      }
    }

    this.x = newX;
    this.y = newY;
  };

  public beginFrame = () => {
    this.flushStroke();
    this.frameActive = true;
    this.pendingStroke = false;
  };

  public endFrame = () => {
    this.flushStroke();
    this.frameActive = false;
  };

  public drawTurtle = () => {
    const { canvas } = this;
    if (canvas === null || !this.visible) {
      return;
    }

    const image = new Image();
    const request = this.imageRequest + 1;
    this.imageRequest = request;
    this.currentImage = image;

    const draw = () => {
      if (
        request !== this.imageRequest ||
        this.currentImage !== image ||
        this.canvas !== canvas
      ) {
        return;
      }

      const context = canvas.getContext("2d");
      if (context === null) {
        return;
      }

      context.save();
      context.translate(this.x, this.y);
      context.rotate((this.dir * Math.PI) / 180 + Math.PI / 2);
      context.drawImage(image, -12, -16);
      context.restore();
      this.currentImage = null;
    };

    image.onload = draw;
    image.onerror = () => {
      if (this.currentImage === image) {
        this.currentImage = null;
      }
    };
    image.src = logoTurtle;

    if (image.complete && image.naturalWidth > 0) {
      draw();
    }
  };

  public cancelImageLoading = () => {
    this.imageRequest += 1;
    if (this.currentImage !== null) {
      this.currentImage.onload = null;
      this.currentImage.onerror = null;
      this.currentImage = null;
    }
  };

  public rotate = (direction: number) => {
    this.dir = (this.dir + direction) % 360;
  };

  public clearCanvas = () => {
    this.cancelImageLoading();
    this.frameActive = false;
    this.pendingStroke = false;
    if (this.canvas === null) {
      return;
    }

    const context = this.canvas.getContext("2d");
    if (context === null) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.resetForReplay();
  };

  public setPen = (isDrawing: boolean) => {
    this.pen = isDrawing;
  };

  public setVisible = (isVisible: boolean) => {
    this.visible = isVisible;
  };

  public home = () => {
    this.x = this.homeX;
    this.y = this.homeY;
    this.dir = 0;
  };

  public setPosition = (x: number, y: number) => {
    this.x = x;
    this.y = y;
  };

  public setBackgroundColor = (color: string) => {
    this.flushStroke();
    if (this.canvas === null) {
      return;
    }

    const context = this.canvas.getContext("2d");
    if (context === null) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = color;
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  public setStrokeColor = (color: string) => {
    if (color !== this.strokeColor) {
      this.flushStroke();
    }
    this.strokeColor = color;
  };

  public setStrokeWeight = (weight: number) => {
    const safeWeight = Math.max(0.25, weight);
    if (safeWeight !== this.strokeWeight) {
      this.flushStroke();
    }
    this.strokeWeight = safeWeight;
  };

  private readonly flushStroke = () => {
    if (!this.pendingStroke || this.canvas === null) {
      return;
    }

    const context = this.canvas.getContext("2d");
    if (context === null) {
      return;
    }

    context.stroke();
    this.pendingStroke = false;
  };

  private readonly resetForReplay = () => {
    this.home();
    this.strokeColor = this.initialStrokeColor;
    this.strokeWeight = this.strokeWeightHome;
    this.pen = this.initialPen;
    this.visible = this.initialVisibility;
  };
}

export interface ITurtleInstance {
  canvas: HTMLCanvasElement | null;
  homeX: number;
  homeY: number;
  dir: number;
  strokeColor: string;
  strokeWeight: number;
  pen: boolean;
  visible: boolean;
}
