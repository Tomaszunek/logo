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
  public opacity: number;
  public dash: readonly [number, number];
  public glow: number;
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
    this.opacity = 1;
    this.dash = [0, 0];
    this.glow = 0;
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
        context.globalAlpha = this.opacity;
        context.setLineDash([...this.dash]);
        context.shadowBlur = this.glow;
        context.shadowColor = this.strokeColor;
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
      context.globalAlpha = 1;
      context.shadowBlur = 0;
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

  public setHeading = (direction: number) => {
    this.dir = direction % 360;
  };

  public drawArc = (angle: number, radius: number) => {
    const context = this.getDrawingContext();
    if (context === null) {
      return;
    }

    const safeRadius = Math.abs(radius);
    if (safeRadius === 0 || angle === 0) {
      return;
    }

    const start = (this.dir * Math.PI) / 180;
    const end = start + (angle * Math.PI) / 180;
    context.beginPath();
    context.arc(this.x, this.y, safeRadius, start, end, angle < 0);
    context.stroke();
  };

  public drawCircle = (radius: number) => {
    this.drawEllipse(radius, radius);
  };

  public drawEllipse = (radiusX: number, radiusY: number) => {
    const context = this.getDrawingContext();
    if (context === null) {
      return;
    }

    const safeRadiusX = Math.abs(radiusX);
    const safeRadiusY = Math.abs(radiusY);
    if (safeRadiusX === 0 || safeRadiusY === 0) {
      return;
    }

    context.beginPath();
    context.ellipse(
      this.x,
      this.y,
      safeRadiusX,
      safeRadiusY,
      (this.dir * Math.PI) / 180,
      0,
      Math.PI * 2,
    );
    context.stroke();
  };

  public drawDot = (size: number) => {
    const context = this.getDrawingContext();
    if (context === null) {
      return;
    }

    const radius = Math.abs(size) / 2;
    if (radius === 0) {
      return;
    }

    context.beginPath();
    context.arc(this.x, this.y, radius, 0, Math.PI * 2);
    context.fillStyle = this.strokeColor;
    context.fill();
  };

  public drawPolygon = (sides: number, radius: number, filled: boolean) => {
    const context = this.getDrawingContext();
    const pointCount = clampInteger(Math.abs(sides), 3, 360);
    const safeRadius = Math.abs(radius);
    if (context === null || safeRadius === 0) {
      return;
    }

    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.dir * Math.PI) / 180);
    context.beginPath();
    for (let index = 0; index < pointCount; index += 1) {
      const angle = (index * Math.PI * 2) / pointCount;
      const x = Math.cos(angle) * safeRadius;
      const y = Math.sin(angle) * safeRadius;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();
    if (filled) {
      context.fill();
    }
    context.stroke();
    context.restore();
  };

  public drawStar = (points: number, radius: number) => {
    const context = this.getDrawingContext();
    const pointCount = clampInteger(Math.abs(points), 3, 180);
    const safeRadius = Math.abs(radius);
    if (context === null || safeRadius === 0) {
      return;
    }

    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.dir * Math.PI) / 180);
    context.beginPath();
    for (let index = 0; index < pointCount * 2; index += 1) {
      const angle = (index * Math.PI) / pointCount;
      const pointRadius = index % 2 === 0 ? safeRadius : safeRadius * 0.42;
      const x = Math.cos(angle) * pointRadius;
      const y = Math.sin(angle) * pointRadius;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();
    context.stroke();
    context.restore();
  };

  public drawSpiral = (turns: number, spacing: number) => {
    const context = this.getDrawingContext();
    const safeTurns = Math.min(100, Math.abs(turns));
    const safeSpacing = Math.abs(spacing);
    if (context === null || safeTurns === 0 || safeSpacing === 0) {
      return;
    }

    const direction = turns < 0 ? -1 : 1;
    const segments = Math.max(12, Math.ceil(safeTurns * 72));
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.dir * Math.PI) / 180);
    context.beginPath();
    context.moveTo(0, 0);
    for (let index = 1; index <= segments; index += 1) {
      const progress = index / segments;
      const angle = direction * progress * safeTurns * Math.PI * 2;
      const radius = progress * safeTurns * safeSpacing;
      context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    context.stroke();
    context.restore();
  };

  public drawCube = (size: number, depth: number) => {
    const context = this.getDrawingContext();
    const half = Math.abs(size) / 2;
    const safeDepth = Math.abs(depth);
    if (context === null || half === 0 || safeDepth === 0) {
      return;
    }

    const offset = safeDepth / Math.sqrt(2);
    const front: readonly Point[] = [
      { x: -half, y: -half },
      { x: half, y: -half },
      { x: half, y: half },
      { x: -half, y: half },
    ];
    const back = front.map(({ x, y }) => ({
      x: x + offset,
      y: y - offset,
    }));

    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.dir * Math.PI) / 180);
    context.beginPath();
    traceClosedShape(context, front);
    traceClosedShape(context, back);
    front.forEach((point, index) => {
      const backPoint = back[index];
      context.moveTo(point.x, point.y);
      context.lineTo(backPoint.x, backPoint.y);
    });
    context.stroke();
    context.restore();
  };

  public drawSphere = (radius: number, detail: number) => {
    const context = this.getDrawingContext();
    const safeRadius = Math.abs(radius);
    const rings = clampInteger(Math.abs(detail), 2, 32);
    if (context === null || safeRadius === 0) {
      return;
    }

    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.dir * Math.PI) / 180);
    context.beginPath();
    context.arc(0, 0, safeRadius, 0, Math.PI * 2);

    for (let index = 1; index < rings; index += 1) {
      const normalized = -1 + (index * 2) / rings;
      const ringRadius = safeRadius * Math.sqrt(1 - normalized ** 2);
      context.ellipse(
        0,
        normalized * safeRadius,
        ringRadius,
        Math.max(0.25, ringRadius * 0.18),
        0,
        0,
        Math.PI * 2,
      );
    }

    for (let index = 1; index < rings; index += 1) {
      const width = safeRadius * Math.abs(Math.cos((index * Math.PI) / rings));
      if (width > 0.25) {
        context.ellipse(0, 0, width, safeRadius, 0, 0, Math.PI * 2);
      }
    }

    context.stroke();
    context.restore();
  };

  public drawPerspectiveGrid = (size: number, divisions: number) => {
    const context = this.getDrawingContext();
    const safeSize = Math.abs(size);
    const count = clampInteger(Math.abs(divisions), 2, 64);
    if (context === null || safeSize === 0) {
      return;
    }

    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.dir * Math.PI) / 180);
    context.beginPath();

    for (let index = 0; index <= count; index += 1) {
      const x = -safeSize + (index * safeSize * 2) / count;
      context.moveTo(0, 0);
      context.lineTo(x, safeSize);
    }

    for (let index = 1; index <= count; index += 1) {
      const progress = index / count;
      const y = safeSize * progress ** 1.7;
      const halfWidth = safeSize * progress;
      context.moveTo(-halfWidth, y);
      context.lineTo(halfWidth, y);
    }

    context.stroke();
    context.restore();
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
    context.globalAlpha = 1;
    context.shadowBlur = 0;
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

  public setOpacity = (opacity: number) => {
    const safeOpacity = Math.min(1, Math.max(0, opacity));
    if (safeOpacity !== this.opacity) {
      this.flushStroke();
    }
    this.opacity = safeOpacity;
  };

  public setDash = (dash: number, gap: number) => {
    const safeDash: readonly [number, number] = [
      Math.max(0, dash),
      Math.max(0, gap),
    ];
    if (safeDash[0] !== this.dash[0] || safeDash[1] !== this.dash[1]) {
      this.flushStroke();
    }
    this.dash = safeDash;
  };

  public setGlow = (blur: number) => {
    const safeGlow = Math.min(100, Math.max(0, blur));
    if (safeGlow !== this.glow) {
      this.flushStroke();
    }
    this.glow = safeGlow;
  };

  private readonly getDrawingContext = (): CanvasRenderingContext2D | null => {
    this.flushStroke();
    if (!this.pen || this.canvas === null) {
      return null;
    }

    const context = this.canvas.getContext("2d");
    if (context === null) {
      return null;
    }

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = this.strokeWeight;
    context.strokeStyle = this.strokeColor;
    context.fillStyle = this.strokeColor;
    context.globalAlpha = this.opacity;
    context.setLineDash([...this.dash]);
    context.shadowBlur = this.glow;
    context.shadowColor = this.strokeColor;
    return context;
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
    this.opacity = 1;
    this.dash = [0, 0];
    this.glow = 0;
    this.pen = this.initialPen;
    this.visible = this.initialVisibility;
  };
}

interface Point {
  x: number;
  y: number;
}

const clampInteger = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, Math.round(value)));

const traceClosedShape = (
  context: CanvasRenderingContext2D,
  points: readonly Point[],
) => {
  const [first] = points;
  context.moveTo(first.x, first.y);
  points.slice(1).forEach(({ x, y }) => {
    context.lineTo(x, y);
  });
  context.closePath();
};

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
