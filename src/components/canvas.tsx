import * as React from "react";
import { ICommandModel } from "src/models";
import { Turtle } from "../utils/turtle";
import { Caller } from "src/utils/caller";

interface IProps {
  text?: string | null;
  commands: Array<ICommandModel>;
}

const Canvas: React.FC<IProps> = ({ commands }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const turtleRef = React.useRef<Turtle | null>(null);
  const callerRef = React.useRef<Caller | null>(null);

  // Lazy initialization of Turtle and Caller
  if (!turtleRef.current) {
    turtleRef.current = new Turtle({
      canvas: null,
      homeX: 400,
      homeY: 400,
      dir: 0,
      strokeColor: "#000000",
      strokeWeight: 1,
      pen: true,
      visible: true,
    });
  }
  if (!callerRef.current) {
    callerRef.current = new Caller(turtleRef.current);
  }

  React.useEffect(() => {
    if (!canvasRef.current) return;
    const turtle = turtleRef.current!;
    const caller = callerRef.current!;

    // Attach canvas to the turtle instance
    turtle.canvas = canvasRef.current;

    // Clear any existing drawing before applying new commands
    turtle.clearCanvas();

    commands.forEach((command: ICommandModel) => {
      if (command.name === "repeat" && command.commands) {
        // @ts-ignore – dynamic method name on Caller; type cannot be inferred
        caller[command.name](command);
      } else if (
        command.name === "setpos" &&
        command.value !== undefined &&
        command.arg2 !== undefined
      ) {
        // @ts-ignore
        caller[command.name](command.value, command.arg2);
      } else if (
        (command.name === "setsc" || command.name === "setbc") &&
        command.color
      ) {
        // @ts-ignore
        caller[command.name](command.color);
      } else {
        // @ts-ignore
        caller[command.name](command.value);
      }
    });

    turtle.drawTurtle();

    return () => {
      if (turtle.canvas) {
        turtle.clearCanvas();
        turtle.canvas = null;
      }
      // Cancel any pending image load
      turtle.cancelImageLoading();
    };
  }, [commands]);

  return (
    <div className="canvas">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        role="img"
        aria-label="Turtle drawing canvas"
      />
    </div>
  );
};

export default Canvas;
