import * as React from "react";
import type { ICommandModel } from "src/models";
import { useCommandStore } from "src/store/commandStore";
import { Turtle } from "../utils/turtle";
import { Caller } from "src/utils/caller";

const Canvas: React.FC = () => {
  const commands = useCommandStore((state) => state.commands);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const turtleRef = React.useRef<Turtle | null>(null);
  const callerRef = React.useRef<Caller | null>(null);

  // Lazy initialization of Turtle and Caller
  turtleRef.current ??= new Turtle({
    canvas: null,
    homeX: 400,
    homeY: 400,
    dir: 0,
    strokeColor: "#000000",
    strokeWeight: 1,
    pen: true,
    visible: true,
  });
  callerRef.current ??= new Caller(turtleRef.current);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const turtle = turtleRef.current;
    const caller = callerRef.current;
    if (canvas === null || turtle === null || caller === null) {
      return undefined;
    }

    // Attach canvas to the turtle instance
    turtle.canvas = canvas;

    // Clear any existing drawing before applying new commands
    turtle.clearCanvas();

    commands.forEach((command: ICommandModel) => { caller.execute(command); });

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
