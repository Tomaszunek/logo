import logoTurtle from "../logoTurtle.png";
import type { BlendMode } from "../models";

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
  public softness: number;
  public flow: number;
  public symmetry: number;
  public blend: BlendMode;
  public palette: readonly string[];
  public pen: boolean;
  public visible: boolean;

  public canvas: HTMLCanvasElement | null;
  private readonly initialStrokeColor: string;
  private readonly initialPen: boolean;
  private readonly initialVisibility: boolean;
  private paintStyle: PaintStyle;
  private currentImage: HTMLImageElement | null = null;
  private imageRequest = 0;
  private frameActive = false;
  private pendingStroke = false;
  private randomState = 123456789;
  private paletteIndex = 0;
  private stateStack: TurtleState[] = [];

  public constructor(turtle: ITurtleInstance) {
    this.x = turtle.homeX;
    this.y = turtle.homeY;
    this.homeX = turtle.homeX;
    this.homeY = turtle.homeY;
    this.canvas = turtle.canvas;
    this.dir = turtle.dir;
    this.strokeColor = turtle.strokeColor;
    this.initialStrokeColor = turtle.strokeColor;
    this.paintStyle = { kind: "solid" };
    this.strokeWeight = turtle.strokeWeight;
    this.strokeWeightHome = turtle.strokeWeight;
    this.opacity = 1;
    this.dash = [0, 0];
    this.glow = 0;
    this.softness = 0;
    this.flow = 1;
    this.symmetry = 1;
    this.blend = "source-over";
    this.palette = [];
    this.pen = turtle.pen;
    this.initialPen = turtle.pen;
    this.visible = turtle.visible;
    this.initialVisibility = turtle.visible;
  }

  public drawLine = (distance: number) => {
    this.drawLineSegment(distance, true);
  };

  public continueLine = (distance: number) => {
    this.drawLineSegment(distance, false);
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
      context.globalCompositeOperation = "source-over";
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

    if (this.softness > 0) {
      this.forEachSymmetry(context, () => {
        this.drawSoftSegment(
          context,
          this.x,
          this.y,
          this.x,
          this.y,
          radius,
        );
      });
      return;
    }

    this.forEachSymmetry(context, () => {
      context.beginPath();
      context.arc(this.x, this.y, radius, 0, Math.PI * 2);
      context.fill();
    });
  };

  public spray = (radius: number, density: number) => {
    const context = this.getDrawingContext();
    const safeRadius = Math.abs(radius);
    const particleCount = clampInteger(Math.abs(density), 1, 1000);
    if (context === null || safeRadius === 0 || this.flow === 0) {
      return;
    }

    const particleSize = Math.max(
      0.5,
      Math.min(this.strokeWeight, safeRadius / 5),
    );
    context.globalAlpha = this.opacity * this.flow;

    for (let index = 0; index < particleCount; index += 1) {
      const angle = this.nextRandom() * Math.PI * 2;
      const distance = Math.sqrt(this.nextRandom()) * safeRadius;
      const x = this.x + Math.cos(angle) * distance;
      const y = this.y + Math.sin(angle) * distance;
      this.forEachSymmetry(context, () => {
        context.fillRect(
          x - particleSize / 2,
          y - particleSize / 2,
          particleSize,
          particleSize,
        );
      });
    }
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

  public drawCube = (
    width: number,
    height: number,
    depth: number,
    rotation = 0,
  ) => {
    const context = this.getDrawingContext();
    const halfWidth = Math.abs(width) / 2;
    const halfHeight = Math.abs(height) / 2;
    const safeDepth = Math.abs(depth);
    if (
      context === null ||
      halfWidth === 0 ||
      halfHeight === 0 ||
      safeDepth === 0
    ) {
      return;
    }

    const offset = safeDepth / Math.sqrt(2);
    const front: readonly Point[] = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight },
    ];
    const back = front.map(({ x, y }) => ({
      x: x + offset,
      y: y - offset,
    }));

    context.save();
    context.translate(this.x, this.y);
    context.rotate(((this.dir + rotation) * Math.PI) / 180);
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
    context.globalCompositeOperation = "source-over";
    context.fillStyle = color;
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  public setGradientBackground = (
    color1: string,
    color2: string,
    angle: number,
  ) => {
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
    context.globalCompositeOperation = "source-over";
    context.fillStyle = this.createLinearGradient(
      context,
      color1,
      color2,
      angle,
    );
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  public setStrokeColor = (color: string) => {
    if (color !== this.strokeColor || this.paintStyle.kind !== "solid") {
      this.flushStroke();
    }
    this.strokeColor = color;
    this.paintStyle = { kind: "solid" };
    this.palette = [];
    this.paletteIndex = 0;
  };

  public setLinearGradient = (
    color1: string,
    color2: string,
    angle: number,
  ) => {
    this.flushStroke();
    this.strokeColor = color1;
    this.paintStyle = { angle, color1, color2, kind: "linear" };
    this.palette = [];
    this.paletteIndex = 0;
  };

  public setRadialGradient = (
    color1: string,
    color2: string,
    radius: number,
  ) => {
    this.flushStroke();
    this.strokeColor = color1;
    this.paintStyle = {
      color1,
      color2,
      kind: "radial",
      radius: Math.max(0.25, Math.abs(radius)),
    };
    this.palette = [];
    this.paletteIndex = 0;
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

  public setSoftness = (softness: number) => {
    const safeSoftness = Math.min(1, Math.max(0, softness));
    if (safeSoftness !== this.softness) {
      this.flushStroke();
    }
    this.softness = safeSoftness;
  };

  public setFlow = (flow: number) => {
    const safeFlow = Math.min(1, Math.max(0, flow));
    if (safeFlow !== this.flow) {
      this.flushStroke();
    }
    this.flow = safeFlow;
  };

  public setSymmetry = (count: number) => {
    const safeCount = clampInteger(Math.abs(count), 1, 24);
    if (safeCount !== this.symmetry) {
      this.flushStroke();
    }
    this.symmetry = safeCount;
  };

  public setBlend = (blend: BlendMode) => {
    if (blend !== this.blend) {
      this.flushStroke();
    }
    this.blend = blend;
  };

  public setSeed = (seed: number) => {
    const normalized = Math.floor(Math.abs(seed)) % 2147483646;
    this.randomState = normalized + 1;
  };

  public setPalette = (palette: readonly string[]) => {
    this.flushStroke();
    this.palette = [...palette];
    this.paletteIndex = 0;
    this.paintStyle = { kind: "solid" };
  };

  public pushState = () => {
    this.flushStroke();
    this.stateStack.push({
      blend: this.blend,
      dash: [...this.dash],
      dir: this.dir,
      flow: this.flow,
      glow: this.glow,
      opacity: this.opacity,
      paintStyle: { ...this.paintStyle },
      palette: [...this.palette],
      paletteIndex: this.paletteIndex,
      pen: this.pen,
      randomState: this.randomState,
      softness: this.softness,
      strokeColor: this.strokeColor,
      strokeWeight: this.strokeWeight,
      symmetry: this.symmetry,
      visible: this.visible,
      x: this.x,
      y: this.y,
    });
  };

  public popState = () => {
    const state = this.stateStack.pop();
    if (state === undefined) {
      return;
    }

    this.flushStroke();
    this.blend = state.blend;
    this.dash = [...state.dash];
    this.dir = state.dir;
    this.flow = state.flow;
    this.glow = state.glow;
    this.opacity = state.opacity;
    this.paintStyle = { ...state.paintStyle };
    this.palette = [...state.palette];
    this.paletteIndex = state.paletteIndex;
    this.pen = state.pen;
    this.randomState = state.randomState;
    this.softness = state.softness;
    this.strokeColor = state.strokeColor;
    this.strokeWeight = state.strokeWeight;
    this.symmetry = state.symmetry;
    this.visible = state.visible;
    this.x = state.x;
    this.y = state.y;
  };

  private readonly drawLineSegment = (
    distance: number,
    advancePalette: boolean,
  ) => {
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
      if (advancePalette) {
        this.applyNextPaletteColor();
      }
      if (this.softness > 0) {
        this.flushStroke();
        this.forEachSymmetry(context, () => {
          this.drawSoftSegment(context, this.x, this.y, newX, newY);
        });
        this.x = newX;
        this.y = newY;
        return;
      }

      if (!this.frameActive || !this.pendingStroke) {
        context.beginPath();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = this.strokeWeight;
        context.strokeStyle = this.resolvePaint(context);
        context.globalAlpha = this.opacity;
        context.setLineDash([...this.dash]);
        context.shadowBlur = this.glow;
        context.shadowColor = this.getGlowColor();
        context.globalCompositeOperation = this.blend;
      }
      this.forEachSymmetry(context, () => {
        context.moveTo(this.x, this.y);
        context.lineTo(newX, newY);
      });
      if (this.frameActive) {
        this.pendingStroke = true;
      } else {
        context.stroke();
      }
    }

    this.x = newX;
    this.y = newY;
  };

  private readonly getDrawingContext = (): CanvasRenderingContext2D | null => {
    if (!this.pen || this.canvas === null) {
      return null;
    }

    this.applyNextPaletteColor();
    this.flushStroke();
    const context = this.canvas.getContext("2d");
    if (context === null) {
      return null;
    }

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = this.strokeWeight;
    const paint = this.resolvePaint(context);
    context.strokeStyle = paint;
    context.fillStyle = paint;
    context.globalAlpha = this.opacity;
    context.setLineDash([...this.dash]);
    context.shadowBlur = this.glow;
    context.shadowColor = this.getGlowColor();
    context.globalCompositeOperation = this.blend;
    return context;
  };

  private readonly forEachSymmetry = (
    context: CanvasRenderingContext2D,
    draw: () => void,
  ) => {
    const centerX = (this.canvas?.width ?? 800) / 2;
    const centerY = (this.canvas?.height ?? 800) / 2;

    for (let index = 0; index < this.symmetry; index += 1) {
      context.save();
      context.translate(centerX, centerY);
      context.rotate((index * Math.PI * 2) / this.symmetry);
      context.translate(-centerX, -centerY);
      draw();
      context.restore();
    }
  };

  private readonly nextRandom = (): number => {
    this.randomState = (this.randomState * 16807) % 2147483647;
    return (this.randomState - 1) / 2147483646;
  };

  private readonly applyNextPaletteColor = () => {
    if (this.palette.length === 0) {
      return;
    }

    const color = this.palette[this.paletteIndex % this.palette.length];
    if (color !== this.strokeColor || this.paintStyle.kind !== "solid") {
      this.flushStroke();
    }
    this.strokeColor = color;
    this.paintStyle = { kind: "solid" };
    this.paletteIndex = (this.paletteIndex + 1) % this.palette.length;
  };

  private readonly drawSoftSegment = (
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    brushRadius = this.strokeWeight / 2,
  ) => {
    if (this.flow === 0) {
      return;
    }

    const radius = Math.max(0.125, brushRadius);
    const distance = Math.hypot(endX - startX, endY - startY);
    const preferredSpacing = Math.max(0.5, radius * 0.28);
    const steps = Math.min(
      Math.max(1, Math.floor(4096 / this.symmetry)),
      Math.max(1, Math.ceil(distance / preferredSpacing)),
    );
    const transparent = transparentHex(this.strokeColor);
    const solidStop = Math.max(0, 1 - this.softness);

    context.globalAlpha = this.opacity * this.flow;
    context.shadowBlur = this.glow;
    context.shadowColor = this.getGlowColor();
    context.globalCompositeOperation = this.blend;

    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps;
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, this.strokeColor);
      if (solidStop > 0) {
        gradient.addColorStop(solidStop, this.strokeColor);
      }
      gradient.addColorStop(1, transparent);
      context.fillStyle = gradient;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
  };

  private readonly resolvePaint = (
    context: CanvasRenderingContext2D,
  ): string | CanvasGradient => {
    if (this.paintStyle.kind === "linear") {
      return this.createLinearGradient(
        context,
        this.paintStyle.color1,
        this.paintStyle.color2,
        this.paintStyle.angle,
      );
    }

    if (this.paintStyle.kind === "radial") {
      const gradient = context.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.paintStyle.radius,
      );
      gradient.addColorStop(0, this.paintStyle.color1);
      gradient.addColorStop(1, this.paintStyle.color2);
      return gradient;
    }

    return this.strokeColor;
  };

  private readonly createLinearGradient = (
    context: CanvasRenderingContext2D,
    color1: string,
    color2: string,
    angle: number,
  ): CanvasGradient => {
    const width = this.canvas?.width ?? 800;
    const height = this.canvas?.height ?? 800;
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = Math.hypot(width, height) / 2;
    const radians = (angle * Math.PI) / 180;
    const offsetX = Math.cos(radians) * distance;
    const offsetY = Math.sin(radians) * distance;
    const gradient = context.createLinearGradient(
      centerX - offsetX,
      centerY - offsetY,
      centerX + offsetX,
      centerY + offsetY,
    );
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  };

  private readonly getGlowColor = (): string =>
    this.paintStyle.kind === "solid"
      ? this.strokeColor
      : this.paintStyle.color2;

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
    this.paintStyle = { kind: "solid" };
    this.strokeWeight = this.strokeWeightHome;
    this.opacity = 1;
    this.dash = [0, 0];
    this.glow = 0;
    this.softness = 0;
    this.flow = 1;
    this.symmetry = 1;
    this.blend = "source-over";
    this.randomState = 123456789;
    this.palette = [];
    this.paletteIndex = 0;
    this.stateStack = [];
    this.pen = this.initialPen;
    this.visible = this.initialVisibility;
  };
}

interface Point {
  x: number;
  y: number;
}

type PaintStyle =
  | { kind: "solid" }
  | {
      kind: "linear";
      color1: string;
      color2: string;
      angle: number;
    }
  | {
      kind: "radial";
      color1: string;
      color2: string;
      radius: number;
    };

interface TurtleState {
  blend: BlendMode;
  dash: readonly [number, number];
  dir: number;
  flow: number;
  glow: number;
  opacity: number;
  paintStyle: PaintStyle;
  palette: readonly string[];
  paletteIndex: number;
  pen: boolean;
  randomState: number;
  softness: number;
  strokeColor: string;
  strokeWeight: number;
  symmetry: number;
  visible: boolean;
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

const transparentHex = (color: string): string => {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, 0)`;
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
