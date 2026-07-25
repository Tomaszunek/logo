import * as React from "react";
import type { ICommandModel } from "src/models";
import { useCommandStore } from "src/store/commandStore";
import { Caller } from "src/utils/caller";
import {
  getCommandComplexity,
  MAX_COMMAND_OPERATIONS,
} from "src/utils/commandComplexity";
import { Turtle } from "../utils/turtle";

const Canvas: React.FC = () => {
  const commands = useCommandStore((state) => state.commands);
  const replaceCommands = useCommandStore((state) => state.replaceCommands);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const turtleRef = React.useRef<Turtle | null>(null);
  const callerRef = React.useRef<Caller | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const [renderWarning, setRenderWarning] = React.useState("");

  turtleRef.current ??= new Turtle({
    canvas: null,
    homeX: 400,
    homeY: 400,
    dir: 0,
    strokeColor: "#111827",
    strokeWeight: 2,
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

    turtle.canvas = canvas;
    turtle.clearCanvas();
    const complexity = getCommandComplexity(commands);
    if (complexity.exceedsLimit) {
      setRenderWarning(
        `Program paused: limit is ${MAX_COMMAND_OPERATIONS.toLocaleString()} operations.`,
      );
      turtle.drawTurtle();
      return () => {
        turtle.cancelImageLoading();
        turtle.canvas = null;
      };
    }

    setRenderWarning("");
    turtle.beginFrame();
    commands.forEach((command: ICommandModel) => {
      caller.execute(command);
    });
    turtle.endFrame();
    turtle.drawTurtle();

    return () => {
      turtle.cancelImageLoading();
      turtle.canvas = null;
    };
  }, [commands]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/gu, "-");
    link.download = `logo-playground-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setAnnouncement("PNG downloaded.");
  };

  const clearProgram = () => {
    replaceCommands([]);
    setAnnouncement("Canvas cleared.");
  };

  return (
    <section className="canvasPanel" aria-labelledby="canvas-title">
      <div className="panelHeader canvasToolbar">
        <div>
          <p className="eyebrow">Live output</p>
          <h2 id="canvas-title">Canvas</h2>
        </div>
        <div className="canvasActions">
          <span className="commandCount">
            {commands.length} {commands.length === 1 ? "step" : "steps"}
          </span>
          <button
            type="button"
            className="button buttonGhost"
            disabled={commands.length === 0}
            onClick={clearProgram}
          >
            Clear
          </button>
          <button
            type="button"
            className="button buttonPrimary"
            onClick={downloadImage}
          >
            Download PNG
          </button>
        </div>
      </div>
      <div className="canvasStage">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          role="img"
          aria-label="Live Turtle Logo drawing canvas"
        />
      </div>
      <div className="canvasMeta">
        {renderWarning === "" ? (
          <span>
            <span className="statusDot" aria-hidden="true" />
            Renders automatically
          </span>
        ) : (
          <span className="canvasWarning">{renderWarning}</span>
        )}
        <span>Light preview · 800 × 800 transparent PNG</span>
      </div>
      <p className="srOnly" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
};

export default Canvas;
