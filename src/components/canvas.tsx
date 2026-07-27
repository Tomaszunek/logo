import * as React from "react";
import type { ICommandModel } from "src/models";
import { useCommandStore } from "src/store/commandStore";
import { useSettingsStore } from "src/store/settingsStore";
import { Caller } from "src/utils/caller";
import {
  expandPlaybackCommands,
  getAnimatedCommandAtTime,
  getCommandAnimationDuration,
  getCommandAnimations,
  getFinalAnimatedCommand,
  hasInfiniteAnimation,
} from "src/utils/commandPlayback";
import {
  getCommandComplexity,
  MAX_COMMAND_OPERATIONS,
} from "src/utils/commandComplexity";
import turtleImage from "../logoTurtle.png";
import { Turtle } from "../utils/turtle";

type ActionKind =
  | "draw"
  | "move"
  | "pen"
  | "shape"
  | "state"
  | "style"
  | "turn"
  | "visibility";
type PlaybackStatus = "complete" | "idle" | "paused" | "playing";

interface TurtlePose {
  direction: number;
  visible: boolean;
  x: number;
  y: number;
}

interface RunningAction {
  command: ICommandModel;
  duration: number;
  from: TurtlePose;
  kind: ActionKind;
  lineStarted: boolean;
  progress: number;
}

interface PlaybackState {
  action: RunningAction | null;
  frameId: number | null;
  index: number;
  isInfiniteScene: boolean;
  lastTimestamp: number | null;
  sampleStride: number;
  sceneElapsedMs: number;
  steps: readonly ICommandModel[];
}

interface ActiveAction {
  kind: ActionKind;
  label: string;
  token: number;
}

const HOME_POSE: TurtlePose = {
  direction: 0,
  visible: true,
  x: 400,
  y: 400,
};
const MAX_DETAILED_ACTIONS = 60;
const MAX_EXACT_REPLAY_STEPS = 5000;
const MAX_INSTANT_STEPS_PER_FRAME = 3000;

const shapeCommands: ReadonlySet<ICommandModel["name"]> = new Set([
  "arc",
  "circle",
  "cube",
  "dot",
  "ellipse",
  "fillpoly",
  "grid3d",
  "polygon",
  "sphere",
  "spiral",
  "spray",
  "star",
]);

const styleCommands: ReadonlySet<ICommandModel["name"]> = new Set([
  "gradientbg",
  "setalpha",
  "setbc",
  "setblend",
  "setdash",
  "setflow",
  "setglow",
  "setgradient",
  "setpalette",
  "setradial",
  "setsc",
  "setseed",
  "setsoftness",
  "setsw",
  "setsymmetry",
]);

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const getActionKind = (name: ICommandModel["name"]): ActionKind => {
  if (name === "fd" || name === "bk") {
    return "draw";
  }

  if (name === "tl" || name === "tr" || name === "seth") {
    return "turn";
  }

  if (name === "setpos" || name === "home") {
    return "move";
  }

  if (name === "penup" || name === "pendown") {
    return "pen";
  }

  if (name === "hideturtle" || name === "showturtle") {
    return "visibility";
  }

  if (shapeCommands.has(name)) {
    return "shape";
  }

  if (styleCommands.has(name)) {
    return "style";
  }

  return "state";
};

const getActionLabel = (command: Readonly<ICommandModel>): string => {
  const animations = getCommandAnimations(command);
  if (animations.length > 0) {
    const properties = animations
      .map(({ property }) => property)
      .join(", ");
    return `${command.name} · ${properties}`;
  }

  const argumentsList = [
    command.value,
    command.arg2,
    command.color,
    command.color2,
    command.blend,
    command.palette?.join(" "),
  ].filter((value) => value !== undefined);

  return [command.name, ...argumentsList].join(" ");
};

const getActionDuration = (
  command: Readonly<ICommandModel>,
  kind: ActionKind,
  isSampledProgram: boolean,
): number => {
  const animationDuration = getCommandAnimationDuration(command);
  if (animationDuration > 0) {
    return animationDuration;
  }

  const durationScale = isSampledProgram ? 0.35 : 1;
  const value = Math.abs(command.value ?? 0);

  if (kind === "draw") {
    return clamp(value * 2.2, 180, 720) * durationScale;
  }

  if (kind === "turn") {
    return clamp(value * 2, 150, 560) * durationScale;
  }

  if (kind === "move") {
    return 420 * durationScale;
  }

  if (kind === "shape") {
    return 300 * durationScale;
  }

  return 190 * durationScale;
};

const getPlaybackButtonLabel = (status: PlaybackStatus): string => {
  if (status === "playing") {
    return "Pause";
  }

  if (status === "paused") {
    return "Resume";
  }

  return "Replay";
};

const getPlaybackStatusLabel = (
  status: PlaybackStatus,
  activeAction: ActiveAction | null,
): string => {
  if (status === "playing" && activeAction !== null) {
    return `Running ${activeAction.label}`;
  }

  if (status === "playing") {
    return "Turtle is drawing";
  }

  if (status === "paused") {
    return "Drawing paused";
  }

  return "Canvas ready";
};

const getRenderModeLabel = (
  animationsEnabled: boolean,
  prefersReducedMotion: boolean,
): string => {
  if (!animationsEnabled) {
    return "Instant rendering";
  }

  if (prefersReducedMotion) {
    return "Reduced motion";
  }

  return "Action animation";
};

const readTurtlePose = (turtle: Readonly<Turtle>): TurtlePose => ({
  direction: turtle.dir,
  visible: turtle.visible,
  x: turtle.x,
  y: turtle.y,
});

const getMovementDistance = (command: Readonly<ICommandModel>): number =>
  command.name === "bk" ? -(command.value ?? 0) : (command.value ?? 0);

const getTurnTarget = (
  command: Readonly<ICommandModel>,
  startDirection: number,
): number => {
  if (command.name === "tl") {
    return startDirection - (command.value ?? 0);
  }

  if (command.name === "tr") {
    return startDirection + (command.value ?? 0);
  }

  const requestedDirection = command.value ?? 0;
  const shortestTurn =
    ((requestedDirection - startDirection + 540) % 360) - 180;
  return startDirection + shortestTurn;
};

const Canvas: React.FC = () => {
  const commands = useCommandStore((state) => state.commands);
  const replaceCommands = useCommandStore((state) => state.replaceCommands);
  const animationsEnabled = useSettingsStore(
    (state) => state.animationsEnabled,
  );
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const turtleRef = React.useRef<Turtle | null>(null);
  const callerRef = React.useRef<Caller | null>(null);
  const playbackRef = React.useRef<PlaybackState>({
    action: null,
    frameId: null,
    index: 0,
    isInfiniteScene: false,
    lastTimestamp: null,
    sampleStride: 1,
    sceneElapsedMs: 0,
    steps: [],
  });
  const actionTokenRef = React.useRef(0);
  const tickRef = React.useRef<(timestamp: number) => void>(() => undefined);
  const speedRef = React.useRef(1);
  const statusRef = React.useRef<PlaybackStatus>("idle");
  const [activeAction, setActiveAction] =
    React.useState<ActiveAction | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const [completedSteps, setCompletedSteps] = React.useState(0);
  const [playbackStatus, setPlaybackStatus] =
    React.useState<PlaybackStatus>("idle");
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [renderWarning, setRenderWarning] = React.useState("");
  const [speed, setSpeed] = React.useState(1);
  const [totalSteps, setTotalSteps] = React.useState(0);
  const [turtlePose, setTurtlePose] =
    React.useState<TurtlePose>(HOME_POSE);

  turtleRef.current ??= new Turtle({
    canvas: null,
    dir: 0,
    homeX: 400,
    homeY: 400,
    pen: true,
    strokeColor: "#111827",
    strokeWeight: 2,
    visible: true,
  });
  callerRef.current ??= new Caller(turtleRef.current);

  const setStatus = React.useCallback((status: PlaybackStatus) => {
    statusRef.current = status;
    setPlaybackStatus(status);
  }, []);

  const cancelPlaybackFrame = React.useCallback(() => {
    const playback = playbackRef.current;
    if (playback.frameId !== null) {
      window.cancelAnimationFrame(playback.frameId);
      playback.frameId = null;
    }
  }, []);

  const updateTurtlePose = React.useCallback(
    (pose?: Readonly<TurtlePose>) => {
      const turtle = turtleRef.current;
      if (turtle === null) {
        return;
      }

      setTurtlePose(pose ?? readTurtlePose(turtle));
    },
    [],
  );

  React.useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);
    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  React.useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const turtle = turtleRef.current;
    const caller = callerRef.current;
    if (canvas === null || turtle === null || caller === null) {
      return undefined;
    }

    cancelPlaybackFrame();
    turtle.canvas = canvas;
    turtle.clearCanvas();
    updateTurtlePose();
    setActiveAction(null);

    const complexity = getCommandComplexity(commands);
    if (complexity.exceedsLimit) {
      setRenderWarning(
        `Program paused: limit is ${MAX_COMMAND_OPERATIONS.toLocaleString()} operations.`,
      );
      playbackRef.current.steps = [];
      setCompletedSteps(0);
      setTotalSteps(0);
      setStatus("idle");
      return () => {
        cancelPlaybackFrame();
        turtle.canvas = null;
      };
    }

    setRenderWarning("");
    const steps = expandPlaybackCommands(commands);
    const playback = playbackRef.current;
    playback.action = null;
    playback.index = 0;
    playback.isInfiniteScene = steps.some(hasInfiniteAnimation);
    playback.lastTimestamp = null;
    playback.sceneElapsedMs = 0;
    playback.sampleStride = Math.max(
      1,
      Math.ceil(steps.length / MAX_DETAILED_ACTIONS),
    );
    playback.steps = steps;
    setCompletedSteps(0);
    setTotalSteps(steps.length);

    const renderExactFinal = () => {
      turtle.clearCanvas();
      turtle.beginFrame();
      steps.forEach((command) => {
        caller.execute(getFinalAnimatedCommand(command));
      });
      turtle.endFrame();
      playback.index = steps.length;
      updateTurtlePose();
    };

    const finishPlayback = (canonicalize = true) => {
      if (canonicalize && steps.length <= MAX_EXACT_REPLAY_STEPS) {
        renderExactFinal();
      }
      playback.action = null;
      setActiveAction(null);
      setCompletedSteps(steps.length);
      setStatus(steps.length === 0 ? "idle" : "complete");
      setAnnouncement(
        steps.length === 0 ? "Canvas ready." : "Drawing complete.",
      );
    };

    const renderAllSteps = () => {
      renderExactFinal();
      finishPlayback(false);
    };

    if (!animationsEnabled || prefersReducedMotion || steps.length === 0) {
      renderAllSteps();
      return () => {
        cancelPlaybackFrame();
        turtle.canvas = null;
      };
    }

    if (playback.isInfiniteScene) {
      const renderSceneAtTime = (elapsedMs: number) => {
        turtle.clearCanvas();
        turtle.beginFrame();
        steps.forEach((command) => {
          caller.execute(getAnimatedCommandAtTime(command, elapsedMs));
        });
        turtle.endFrame();
        playback.index = steps.length;
        setCompletedSteps(steps.length);
        updateTurtlePose();
      };

      const token = actionTokenRef.current + 1;
      actionTokenRef.current = token;
      setActiveAction({
        kind: "shape",
        label: "live animation scene",
        token,
      });

      tickRef.current = (timestamp: number) => {
        if (statusRef.current !== "playing") {
          return;
        }

        const previousTimestamp = playback.lastTimestamp ?? timestamp;
        const elapsed = Math.min(100, timestamp - previousTimestamp);
        playback.lastTimestamp = timestamp;
        playback.sceneElapsedMs += elapsed * speedRef.current;
        renderSceneAtTime(playback.sceneElapsedMs);
        playback.frameId = window.requestAnimationFrame(tickRef.current);
      };

      renderSceneAtTime(0);
      setStatus("playing");
      playback.frameId = window.requestAnimationFrame(tickRef.current);
      return () => {
        cancelPlaybackFrame();
        turtle.canvas = null;
      };
    }

    const beginAction = (command: ICommandModel) => {
      const kind = getActionKind(command.name);
      const token = actionTokenRef.current + 1;
      actionTokenRef.current = token;
      playback.action = {
        command,
        duration: getActionDuration(
          command,
          kind,
          playback.sampleStride > 1,
        ),
        from: readTurtlePose(turtle),
        kind,
        lineStarted: false,
        progress: 0,
      };
      setActiveAction({
        kind,
        label: getActionLabel(command),
        token,
      });

      if (
        getCommandAnimations(command).length === 0 &&
        kind !== "draw" &&
        kind !== "move" &&
        kind !== "turn"
      ) {
        turtle.beginFrame();
        caller.execute(command);
        turtle.endFrame();
        updateTurtlePose();
      }
    };

    const applyActionProgress = (nextProgress: number) => {
      const { action } = playback;
      if (action === null) {
        return;
      }

      const progressDelta = nextProgress - action.progress;
      const { command, from, kind } = action;

      if (getCommandAnimations(command).length > 0) {
        turtle.clearCanvas();
        turtle.beginFrame();
        for (let index = 0; index < playback.index; index += 1) {
          caller.execute(getFinalAnimatedCommand(steps[index]));
        }
        caller.execute(
          getAnimatedCommandAtTime(command, nextProgress * action.duration),
        );
        turtle.endFrame();
      } else if (kind === "draw" && progressDelta > 0) {
        const distance = getMovementDistance(command) * progressDelta;
        turtle.beginFrame();
        if (action.lineStarted) {
          turtle.continueLine(distance);
        } else {
          turtle.drawLine(distance);
          action.lineStarted = true;
        }
        turtle.endFrame();
      } else if (kind === "turn") {
        const targetDirection = getTurnTarget(command, from.direction);
        turtle.dir =
          from.direction +
          (targetDirection - from.direction) * nextProgress;
      } else if (kind === "move") {
        const targetX =
          command.name === "home"
            ? turtle.homeX
            : (command.value ?? from.x);
        const targetY =
          command.name === "home"
            ? turtle.homeY
            : (command.arg2 ?? from.y);
        turtle.setPosition(
          from.x + (targetX - from.x) * nextProgress,
          from.y + (targetY - from.y) * nextProgress,
        );

        if (command.name === "home") {
          const targetDirection = getTurnTarget(
            { ...command, name: "seth", value: 0 },
            from.direction,
          );
          turtle.dir =
            from.direction +
            (targetDirection - from.direction) * nextProgress;
        }
      }

      action.progress = nextProgress;
      updateTurtlePose();
    };

    const completeAction = () => {
      const { action } = playback;
      if (action === null) {
        return;
      }

      applyActionProgress(1);
      const { command, from, kind } = action;
      if (
        kind === "draw" &&
        getCommandAnimations(command).length === 0
      ) {
        const radians = (from.direction * Math.PI) / 180;
        const distance = getMovementDistance(command);
        turtle.setPosition(
          from.x + Math.cos(radians) * distance,
          from.y + Math.sin(radians) * distance,
        );
      } else if (
        kind === "turn" &&
        getCommandAnimations(command).length === 0
      ) {
        turtle.dir = getTurnTarget(command, from.direction);
      } else if (
        kind === "move" &&
        command.name === "home" &&
        getCommandAnimations(command).length === 0
      ) {
        turtle.setPosition(turtle.homeX, turtle.homeY);
        turtle.dir = 0;
      }

      playback.action = null;
      playback.index += 1;
      playback.lastTimestamp = null;
      setCompletedSteps(playback.index);
      updateTurtlePose();
    };

    tickRef.current = (timestamp: number) => {
      if (statusRef.current !== "playing") {
        return;
      }

      const activePlayback = playbackRef.current;
      let instantSteps = 0;
      while (
        activePlayback.action === null &&
        activePlayback.index < steps.length &&
        activePlayback.index % activePlayback.sampleStride !== 0 &&
        getCommandAnimations(steps[activePlayback.index]).length === 0 &&
        instantSteps < MAX_INSTANT_STEPS_PER_FRAME
      ) {
        const command = steps[activePlayback.index];
        turtle.beginFrame();
        caller.execute(command);
        turtle.endFrame();
        activePlayback.index += 1;
        instantSteps += 1;
      }

      if (instantSteps > 0) {
        setCompletedSteps(activePlayback.index);
        updateTurtlePose();
      }

      if (activePlayback.index >= steps.length) {
        activePlayback.frameId = null;
        finishPlayback();
        return;
      }

      if (activePlayback.action === null) {
        beginAction(steps[activePlayback.index]);
      }

      const { action } = activePlayback;
      if (action !== null) {
        const previousTimestamp =
          activePlayback.lastTimestamp ?? timestamp;
        const elapsed = Math.min(100, timestamp - previousTimestamp);
        activePlayback.lastTimestamp = timestamp;
        const nextProgress = Math.min(
          1,
          action.progress +
            (elapsed * speedRef.current) / action.duration,
        );
        applyActionProgress(nextProgress);

        if (nextProgress >= 1) {
          completeAction();
        }
      }

      activePlayback.frameId = window.requestAnimationFrame(tickRef.current);
    };

    setStatus("playing");
    playback.frameId = window.requestAnimationFrame(tickRef.current);

    return () => {
      cancelPlaybackFrame();
      turtle.canvas = null;
    };
  }, [
    cancelPlaybackFrame,
    animationsEnabled,
    commands,
    prefersReducedMotion,
    setStatus,
    updateTurtlePose,
  ]);

  const replay = () => {
    const canvas = canvasRef.current;
    const turtle = turtleRef.current;
    const playback = playbackRef.current;
    if (
      canvas === null ||
      turtle === null ||
      playback.steps.length === 0 ||
      !animationsEnabled ||
      prefersReducedMotion
    ) {
      return;
    }

    cancelPlaybackFrame();
    turtle.clearCanvas();
    playback.action = null;
    playback.index = playback.isInfiniteScene ? playback.steps.length : 0;
    playback.lastTimestamp = null;
    playback.sceneElapsedMs = 0;
    if (playback.isInfiniteScene) {
      const token = actionTokenRef.current + 1;
      actionTokenRef.current = token;
      setActiveAction({
        kind: "shape",
        label: "live animation scene",
        token,
      });
    } else {
      setActiveAction(null);
    }
    setCompletedSteps(
      playback.isInfiniteScene ? playback.steps.length : 0,
    );
    updateTurtlePose();
    setStatus("playing");
    playback.frameId = window.requestAnimationFrame(tickRef.current);
    setAnnouncement("Replaying drawing.");
  };

  const togglePlayback = () => {
    const playback = playbackRef.current;
    if (playbackStatus === "complete") {
      replay();
      return;
    }

    if (playbackStatus === "playing") {
      cancelPlaybackFrame();
      playback.lastTimestamp = null;
      setStatus("paused");
      setAnnouncement("Drawing paused.");
      return;
    }

    if (playbackStatus === "paused") {
      playback.lastTimestamp = null;
      setStatus("playing");
      playback.frameId = window.requestAnimationFrame(tickRef.current);
      setAnnouncement("Drawing resumed.");
    }
  };

  const finishNow = () => {
    const turtle = turtleRef.current;
    const caller = callerRef.current;
    const playback = playbackRef.current;
    if (turtle === null || caller === null || playback.steps.length === 0) {
      return;
    }

    cancelPlaybackFrame();
    turtle.clearCanvas();
    turtle.beginFrame();
    playback.steps.forEach((command) => {
      caller.execute(getFinalAnimatedCommand(command));
    });
    turtle.endFrame();
    playback.action = null;
    playback.index = playback.steps.length;
    playback.lastTimestamp = null;
    setActiveAction(null);
    setCompletedSteps(playback.steps.length);
    updateTurtlePose();
    setStatus("complete");
    setAnnouncement("Drawing completed immediately.");
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    if (
      !playbackRef.current.isInfiniteScene &&
      (playbackStatus === "playing" ||
        playbackStatus === "paused")
    ) {
      finishNow();
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
        <div className="canvasViewport">
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            role="img"
            aria-label="Animated Turtle Logo drawing canvas"
          />
          {activeAction !== null && (
            <span
              key={activeAction.token}
              className={`actionIndicator action-${activeAction.kind}`}
            >
              {activeAction.label}
            </span>
          )}
          {activeAction !== null && (
            <span
              key={`pulse-${activeAction.token}`}
              className={`actionPulse action-${activeAction.kind}`}
              style={{
                left: `${(turtlePose.x / 800) * 100}%`,
                top: `${(turtlePose.y / 800) * 100}%`,
              }}
              aria-hidden="true"
            />
          )}
          {turtlePose.visible && (
            <img
              src={turtleImage}
              alt=""
              className={`animatedTurtle${
                playbackStatus === "playing" ? " isMoving" : ""
              }`}
              style={{
                left: `${(turtlePose.x / 800) * 100}%`,
                top: `${(turtlePose.y / 800) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${
                  turtlePose.direction + 90
                }deg)`,
              }}
            />
          )}
        </div>
      </div>
      {animationsEnabled && !prefersReducedMotion && totalSteps > 0 && (
        <div className="canvasPlayback" aria-label="Drawing playback controls">
          <button
            type="button"
            className="button buttonGhost playbackButton"
            onClick={togglePlayback}
          >
            {getPlaybackButtonLabel(playbackStatus)}
          </button>
          <button
            type="button"
            className="button buttonGhost playbackButton"
            disabled={playbackStatus === "complete"}
            onClick={finishNow}
          >
            Finish now
          </button>
          <label className="speedControl">
            <span>Speed</span>
            <select
              value={speed}
              onChange={(event) => {
                setSpeed(Number(event.currentTarget.value));
              }}
            >
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </label>
          <span className="playbackProgress" aria-live="off">
            {completedSteps.toLocaleString()} / {totalSteps.toLocaleString()}{" "}
            actions
          </span>
        </div>
      )}
      <div className="canvasMeta">
        {renderWarning === "" ? (
          <span>
            <span
              className={`statusDot${
                playbackStatus === "playing" ? " isAnimating" : ""
              }`}
              aria-hidden="true"
            />
            {getPlaybackStatusLabel(playbackStatus, activeAction)}
          </span>
        ) : (
          <span className="canvasWarning">{renderWarning}</span>
        )}
        <span>
          {getRenderModeLabel(animationsEnabled, prefersReducedMotion)} · 800 ×
          800 transparent PNG
        </span>
      </div>
      <p className="srOnly" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
};

export default Canvas;
