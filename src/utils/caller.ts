import type { ICommandModel } from "src/models";
import type { Turtle } from "./turtle";

export class Caller {
  private readonly turtle: Turtle;

  public constructor(turtle: Turtle) {
    this.turtle = turtle;
  }

  public execute = (command: ICommandModel) => {
    switch (command.name) {
      case "repeat":
        this.repeat(command);
        break;
      case "setpos":
        if (command.value !== undefined && command.arg2 !== undefined) {
          this.setpos(command.value, command.arg2);
        }
        break;
      case "setsc":
        this.setsc(command.color);
        break;
      case "setbc":
        this.setbc(command.color);
        break;
      case "fd":
      case "bk":
      case "tl":
      case "tr":
      case "setsw":
        this[command.name](command.value ?? 0);
        break;
      case "hideturtle":
      case "showturtle":
      case "home":
      case "penup":
      case "pendown":
        this[command.name]();
        break;
      default:
        break;
    }
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
}
