import { describe, expect, it, vi } from "vitest";
import { Caller } from "./caller";
import { Turtle } from "./turtle";

const createHarness = () => {
  const context = {
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    setTransform: vi.fn(),
    stroke: vi.fn(),
    fillStyle: "",
    lineCap: "butt",
    lineJoin: "miter",
    lineWidth: 1,
    strokeStyle: "",
  };
  const canvas = {
    width: 800,
    height: 800,
    getContext: vi.fn(() => context),
  };
  const turtle = new Turtle({
    canvas: null,
    homeX: 400,
    homeY: 400,
    dir: 0,
    strokeColor: "#111827",
    strokeWeight: 2,
    pen: true,
    visible: true,
  });
  Reflect.set(turtle, "canvas", canvas);

  return { caller: new Caller(turtle), canvas, context, turtle };
};

describe("Turtle and Caller", () => {
  it("draws forward and turns left counter-clockwise", () => {
    const { caller, context, turtle } = createHarness();

    caller.fd(100);
    caller.tl(90);
    caller.fd(100);

    expect(context.moveTo).toHaveBeenNthCalledWith(1, 400, 400);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 500, 400);
    expect(context.moveTo).toHaveBeenNthCalledWith(2, 500, 400);
    expect(context.lineTo.mock.calls[1]?.[0]).toBeCloseTo(500);
    expect(context.lineTo.mock.calls[1]?.[1]).toBeCloseTo(300);
    expect(turtle.dir).toBe(-90);
  });

  it("moves without drawing while the pen is up", () => {
    const { caller, context, turtle } = createHarness();

    caller.penup();
    caller.fd(50);
    caller.pendown();
    caller.fd(25);

    expect(context.stroke).toHaveBeenCalledOnce();
    expect(context.moveTo).toHaveBeenCalledWith(450, 400);
    expect(context.lineTo).toHaveBeenCalledWith(475, 400);
    expect(turtle.x).toBe(475);
  });

  it("applies stroke and background styles", () => {
    const { caller, context } = createHarness();

    caller.setbc("#102030");
    caller.setsc("#79f2c0");
    caller.setsw(3);
    caller.fd(10);

    expect(context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    expect(context.fillStyle).toBe("#102030");
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 800, 800);
    expect(context.strokeStyle).toBe("#79f2c0");
    expect(context.lineWidth).toBe(3);
  });

  it("executes repeat exactly the requested number of times", () => {
    const { caller, context, turtle } = createHarness();

    caller.execute({
      id: 0,
      name: "repeat",
      value: 4,
      commands: [
        { id: 1, name: "fd", value: 100 },
        { id: 2, name: "tr", value: 90 },
      ],
    });

    expect(context.stroke).toHaveBeenCalledTimes(4);
    expect(turtle.x).toBeCloseTo(400);
    expect(turtle.y).toBeCloseTo(400);
    expect(turtle.dir % 360).toBe(0);
  });

  it("resets all transient state before a replay", () => {
    const { caller, context, turtle } = createHarness();

    caller.penup();
    caller.hideturtle();
    caller.setsc("#ff00aa");
    caller.setsw(8);
    caller.fd(40);
    turtle.clearCanvas();

    expect(turtle).toMatchObject({
      x: 400,
      y: 400,
      dir: 0,
      pen: true,
      visible: true,
      strokeColor: "#111827",
      strokeWeight: 2,
    });
    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 800, 800);
  });

  it("keeps pen and style state when the home command is used", () => {
    const { caller, turtle } = createHarness();

    caller.penup();
    caller.setsc("#ff00aa");
    caller.fd(40);
    caller.home();

    expect(turtle).toMatchObject({
      x: 400,
      y: 400,
      dir: 0,
      pen: false,
      strokeColor: "#ff00aa",
    });
  });
});
