import type { ICommandModel } from "src/models";
import type { Turtle } from "./turtle";

export class Caller {
  private readonly turtle: Turtle;

  public constructor(turtle: Turtle) {
    this.turtle = turtle;
  }

  public execute = (command: ICommandModel) => {
    if (command.name === "repeat") {
      this.repeat(command);
      return;
    }

    const pairAction = pairActions[command.name];
    if (
      pairAction !== undefined &&
      command.value !== undefined &&
      command.arg2 !== undefined
    ) {
      pairAction(this, command.value, command.arg2);
      return;
    }

    const colorAction = colorActions[command.name];
    if (colorAction !== undefined) {
      colorAction(this, command.color);
      return;
    }

    const numberAction = numberActions[command.name];
    if (numberAction !== undefined) {
      numberAction(this, command.value ?? 0);
      return;
    }

    noArgumentActions[command.name]?.(this);
  };

  public fd = (distance: number) => {
    this.turtle.drawLine(distance);
  };

  public bk = (distance: number) => {
    this.turtle.drawLine(-distance);
  };

  public tl = (direction: number) => {
    this.turtle.rotate(-direction);
  };

  public tr = (direction: number) => {
    this.turtle.rotate(direction);
  };

  public seth = (direction: number) => {
    this.turtle.setHeading(direction);
  };

  public arc = (angle: number, radius: number) => {
    this.turtle.drawArc(angle, radius);
  };

  public circle = (radius: number) => {
    this.turtle.drawCircle(radius);
  };

  public ellipse = (radiusX: number, radiusY: number) => {
    this.turtle.drawEllipse(radiusX, radiusY);
  };

  public dot = (size: number) => {
    this.turtle.drawDot(size);
  };

  public polygon = (sides: number, radius: number) => {
    this.turtle.drawPolygon(sides, radius, false);
  };

  public fillpoly = (sides: number, radius: number) => {
    this.turtle.drawPolygon(sides, radius, true);
  };

  public star = (points: number, radius: number) => {
    this.turtle.drawStar(points, radius);
  };

  public spiral = (turns: number, spacing: number) => {
    this.turtle.drawSpiral(turns, spacing);
  };

  public cube = (size: number, depth: number) => {
    this.turtle.drawCube(size, depth);
  };

  public sphere = (radius: number, detail: number) => {
    this.turtle.drawSphere(radius, detail);
  };

  public grid3d = (size: number, divisions: number) => {
    this.turtle.drawPerspectiveGrid(size, divisions);
  };

  public repeat = (command: ICommandModel) => {
    if (command.value !== undefined && command.value !== 0) {
      for (let index = 0; index < command.value; index += 1) {
        command.commands?.forEach((nestedCommand) => {
          this.execute(nestedCommand);
        });
      }
    }
  };

  public hideturtle = () => {
    this.turtle.setVisible(false);
  };

  public showturtle = () => {
    this.turtle.setVisible(true);
  };

  public home = () => {
    this.turtle.home();
  };

  public penup = () => {
    this.turtle.setPen(false);
  };

  public pendown = () => {
    this.turtle.setPen(true);
  };

  public setpos = (x: number, y: number) => {
    this.turtle.setPosition(x, y);
  };

  public setbc = (color?: string) => {
    if (color !== undefined && color !== "") {
      this.turtle.setBackgroundColor(color);
    }
  };

  public setsc = (color?: string) => {
    if (color !== undefined && color !== "") {
      this.turtle.setStrokeColor(color);
    }
  };

  public setsw = (weight: number) => {
    this.turtle.setStrokeWeight(weight);
  };

  public setalpha = (opacity: number) => {
    this.turtle.setOpacity(opacity);
  };

  public setdash = (dash: number, gap: number) => {
    this.turtle.setDash(dash, gap);
  };

  public setglow = (blur: number) => {
    this.turtle.setGlow(blur);
  };
}

type NumberAction = (caller: Caller, value: number) => void;
type PairAction = (caller: Caller, first: number, second: number) => void;
type ColorAction = (caller: Caller, color?: string) => void;
type NoArgumentAction = (caller: Caller) => void;

const numberActions: Readonly<
  Partial<Record<ICommandModel["name"], NumberAction>>
> = {
  bk: (caller, value) => { caller.bk(value); },
  circle: (caller, value) => { caller.circle(value); },
  dot: (caller, value) => { caller.dot(value); },
  fd: (caller, value) => { caller.fd(value); },
  setalpha: (caller, value) => { caller.setalpha(value); },
  setglow: (caller, value) => { caller.setglow(value); },
  seth: (caller, value) => { caller.seth(value); },
  setsw: (caller, value) => { caller.setsw(value); },
  tl: (caller, value) => { caller.tl(value); },
  tr: (caller, value) => { caller.tr(value); },
};

const pairActions: Readonly<
  Partial<Record<ICommandModel["name"], PairAction>>
> = {
  arc: (caller, angle, radius) => { caller.arc(angle, radius); },
  cube: (caller, size, depth) => { caller.cube(size, depth); },
  ellipse: (caller, radiusX, radiusY) => {
    caller.ellipse(radiusX, radiusY);
  },
  fillpoly: (caller, sides, radius) => { caller.fillpoly(sides, radius); },
  grid3d: (caller, size, divisions) => { caller.grid3d(size, divisions); },
  polygon: (caller, sides, radius) => { caller.polygon(sides, radius); },
  setdash: (caller, dash, gap) => { caller.setdash(dash, gap); },
  setpos: (caller, x, y) => { caller.setpos(x, y); },
  sphere: (caller, radius, detail) => { caller.sphere(radius, detail); },
  spiral: (caller, turns, spacing) => { caller.spiral(turns, spacing); },
  star: (caller, points, radius) => { caller.star(points, radius); },
};

const colorActions: Readonly<
  Partial<Record<ICommandModel["name"], ColorAction>>
> = {
  setbc: (caller, color) => { caller.setbc(color); },
  setsc: (caller, color) => { caller.setsc(color); },
};

const noArgumentActions: Readonly<
  Partial<Record<ICommandModel["name"], NoArgumentAction>>
> = {
  hideturtle: (caller) => { caller.hideturtle(); },
  home: (caller) => { caller.home(); },
  pendown: (caller) => { caller.pendown(); },
  penup: (caller) => { caller.penup(); },
  showturtle: (caller) => { caller.showturtle(); },
};
