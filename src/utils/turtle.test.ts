import { describe, expect, it, vi } from "vitest";
import { Caller } from "./caller";
import { Turtle } from "./turtle";

const createHarness = () => {
  const linearGradient = { addColorStop: vi.fn() };
  const radialGradient = { addColorStop: vi.fn() };
  const context = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    closePath: vi.fn(),
    createLinearGradient: vi.fn(() => linearGradient),
    createRadialGradient: vi.fn(() => radialGradient),
    ellipse: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: "",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    lineCap: "butt",
    lineJoin: "miter",
    lineTo: vi.fn(),
    lineWidth: 1,
    moveTo: vi.fn(),
    restore: vi.fn(),
    rotate: vi.fn(),
    save: vi.fn(),
    setLineDash: vi.fn(),
    setTransform: vi.fn(),
    shadowBlur: 0,
    shadowColor: "",
    stroke: vi.fn(),
    strokeStyle: "",
    translate: vi.fn(),
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

  return {
    caller: new Caller(turtle),
    canvas,
    context,
    linearGradient,
    radialGradient,
    turtle,
  };
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

  it("draws centered arcs, circles, ellipses, and dots", () => {
    const { caller, context, turtle } = createHarness();

    caller.seth(90);
    caller.arc(120, 80);
    caller.circle(40);
    caller.ellipse(70, 25);
    caller.dot(12);

    expect(context.arc).toHaveBeenNthCalledWith(
      1,
      400,
      400,
      80,
      Math.PI / 2,
      Math.PI / 2 + (120 * Math.PI) / 180,
      false,
    );
    expect(context.ellipse).toHaveBeenNthCalledWith(
      1,
      400,
      400,
      40,
      40,
      Math.PI / 2,
      0,
      Math.PI * 2,
    );
    expect(context.ellipse).toHaveBeenNthCalledWith(
      2,
      400,
      400,
      70,
      25,
      Math.PI / 2,
      0,
      Math.PI * 2,
    );
    expect(context.arc).toHaveBeenNthCalledWith(
      2,
      400,
      400,
      6,
      0,
      Math.PI * 2,
    );
    expect(context.stroke).toHaveBeenCalledTimes(3);
    expect(context.fill).toHaveBeenCalledOnce();
    expect(turtle).toMatchObject({ x: 400, y: 400, dir: 90 });
  });

  it("applies opacity and dash patterns to new marks", () => {
    const { caller, context } = createHarness();

    caller.setalpha(0.35);
    caller.setdash(8, 4);
    caller.fd(20);

    expect(context.globalAlpha).toBe(0.35);
    expect(context.setLineDash).toHaveBeenLastCalledWith([8, 4]);
  });

  it("keeps one palette color across animated line segments", () => {
    const { caller, turtle } = createHarness();

    caller.setpalette(["#ff0000", "#00ff00"]);
    turtle.drawLine(10);
    turtle.continueLine(10);

    expect(turtle.strokeColor).toBe("#ff0000");

    turtle.drawLine(10);

    expect(turtle.strokeColor).toBe("#00ff00");
    expect(turtle.x).toBe(430);
  });

  it("draws scene primitives and applies neon glow", () => {
    const { caller, context } = createHarness();

    caller.setglow(18);
    caller.polygon(6, 80);
    caller.fillpoly(5, 40);
    caller.star(9, 120);
    caller.spiral(-4, 7);
    caller.cube(100, 45);
    caller.sphere(90, 8);
    caller.grid3d(260, 12);

    expect(context.shadowBlur).toBe(18);
    expect(context.shadowColor).toBe("#111827");
    expect(context.fill).toHaveBeenCalledOnce();
    expect(context.closePath).toHaveBeenCalledTimes(5);
    expect(context.stroke).toHaveBeenCalledTimes(7);
    expect(context.save).toHaveBeenCalledTimes(7);
    expect(context.restore).toHaveBeenCalledTimes(7);
  });

  it("renders linear, radial, and background gradients", () => {
    const {
      caller,
      context,
      linearGradient,
      radialGradient,
    } = createHarness();

    caller.gradientbg("#071013", "#240046", 90);
    caller.setgradient("#ff006e", "#3a86ff", 45);
    caller.circle(80);
    caller.setradial("#ffffff", "#8338ec", 160);
    caller.fillpoly(6, 70);

    expect(context.createLinearGradient).toHaveBeenCalledTimes(2);
    expect(context.createRadialGradient).toHaveBeenCalledWith(
      400,
      400,
      0,
      400,
      400,
      160,
    );
    expect(linearGradient.addColorStop).toHaveBeenCalledWith(0, "#071013");
    expect(linearGradient.addColorStop).toHaveBeenCalledWith(1, "#3a86ff");
    expect(radialGradient.addColorStop).toHaveBeenCalledWith(0, "#ffffff");
    expect(radialGradient.addColorStop).toHaveBeenCalledWith(1, "#8338ec");
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 800, 800);
    expect(context.stroke).toHaveBeenCalledTimes(2);
    expect(context.fill).toHaveBeenCalledOnce();
  });

  it("draws a soft pen with an opaque core and transparent edge", () => {
    const { caller, context, radialGradient, turtle } = createHarness();

    caller.setsw(40);
    caller.setsoftness(0.75);
    caller.setflow(0.6);
    caller.fd(20);

    expect(context.stroke).not.toHaveBeenCalled();
    expect(context.createRadialGradient).toHaveBeenCalled();
    expect(context.fillRect.mock.calls.length).toBeGreaterThan(1);
    expect(context.globalAlpha).toBe(0.6);
    expect(radialGradient.addColorStop).toHaveBeenCalledWith(0, "#111827");
    expect(radialGradient.addColorStop).toHaveBeenCalledWith(0.25, "#111827");
    expect(radialGradient.addColorStop).toHaveBeenCalledWith(
      1,
      "rgba(17, 24, 39, 0)",
    );
    expect(turtle.x).toBe(420);
  });

  it("replicates pen marks with rotational symmetry", () => {
    const { caller, context, turtle } = createHarness();

    caller.setsymmetry(6);
    caller.fd(40);

    expect(context.moveTo).toHaveBeenCalledTimes(6);
    expect(context.lineTo).toHaveBeenCalledTimes(6);
    expect(context.rotate).toHaveBeenCalledTimes(6);
    expect(context.stroke).toHaveBeenCalledOnce();
    expect(turtle).toMatchObject({ x: 440, y: 400, symmetry: 6 });
  });

  it("applies blend modes and deterministic symmetrical spray", () => {
    const first = createHarness();
    const second = createHarness();

    first.caller.setblend("screen");
    first.caller.setsymmetry(3);
    first.caller.spray(30, 10);
    second.caller.setblend("screen");
    second.caller.setsymmetry(3);
    second.caller.spray(30, 10);

    expect(first.context.globalCompositeOperation).toBe("screen");
    expect(first.context.fillRect).toHaveBeenCalledTimes(30);
    expect(first.context.fillRect.mock.calls).toEqual(
      second.context.fillRect.mock.calls,
    );
  });

  it("cycles palette colors once per logical mark", () => {
    const { caller, context, turtle } = createHarness();

    caller.setpalette(["#ff006e", "#ffb703", "#3a86ff"]);
    caller.fd(10);
    expect(context.strokeStyle).toBe("#ff006e");
    caller.fd(10);
    expect(context.strokeStyle).toBe("#ffb703");
    caller.dot(5);
    expect(context.fillStyle).toBe("#3a86ff");
    caller.fd(10);
    expect(context.strokeStyle).toBe("#ff006e");
    expect(turtle.palette).toEqual(["#ff006e", "#ffb703", "#3a86ff"]);
  });

  it("restores complete turtle state with push and pop", () => {
    const { caller, turtle } = createHarness();

    caller.setseed(99);
    caller.setpalette(["#ff006e", "#3a86ff"]);
    caller.setsw(8);
    caller.setalpha(0.4);
    caller.setblend("screen");
    caller.setsymmetry(4);
    caller.push();
    caller.fd(50);
    caller.tr(90);
    caller.setsw(2);
    caller.setalpha(1);
    caller.setblend("multiply");
    caller.setsymmetry(1);
    caller.pop();

    expect(turtle).toMatchObject({
      x: 400,
      y: 400,
      dir: 0,
      strokeWeight: 8,
      opacity: 0.4,
      blend: "screen",
      symmetry: 4,
      palette: ["#ff006e", "#3a86ff"],
    });
  });

  it("changes deterministic spray patterns with setseed", () => {
    const first = createHarness();
    const second = createHarness();

    first.caller.setseed(10);
    second.caller.setseed(20);
    first.caller.spray(30, 8);
    second.caller.spray(30, 8);

    expect(first.context.fillRect.mock.calls).not.toEqual(
      second.context.fillRect.mock.calls,
    );
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

  it("batches same-style segments into one canvas stroke per frame", () => {
    const { caller, context, turtle } = createHarness();

    turtle.beginFrame();
    caller.execute({
      id: 0,
      name: "repeat",
      value: 4,
      commands: [
        { id: 1, name: "fd", value: 100 },
        { id: 2, name: "tr", value: 90 },
      ],
    });
    turtle.endFrame();

    expect(context.lineTo).toHaveBeenCalledTimes(4);
    expect(context.beginPath).toHaveBeenCalledOnce();
    expect(context.stroke).toHaveBeenCalledOnce();
  });

  it("flushes a batch before a style or background change", () => {
    const { caller, context, turtle } = createHarness();

    turtle.beginFrame();
    caller.fd(20);
    caller.setsc("#ff00aa");
    caller.fd(20);
    caller.setbc("#102030");
    turtle.endFrame();

    expect(context.stroke).toHaveBeenCalledTimes(2);
    expect(context.stroke.mock.invocationCallOrder[1]).toBeLessThan(
      context.fillRect.mock.invocationCallOrder[0] ?? 0,
    );
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
