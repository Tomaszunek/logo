import type {
  ICommandModel,
  IExampleCollection,
  IPathwayExample,
} from "../models";
import { Parser } from "../utils/parser";
import { biohazardScanlines } from "./biohazardScanlines";

interface ExampleSpec {
  name: string;
  source: string;
  image: string;
  type: IPathwayExample["type"];
  animationFocus?: string;
  performanceFocus?: string;
  scale?: number;
  start?: readonly [x: number, y: number];
}

const round = (value: number): number => Math.round(value * 100) / 100;

const getProcedureName = (exampleName: string): string =>
  `draw_${exampleName
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "_")
    .replace(/^_+|_+$/gu, "")}`;

interface SourceProcedure {
  body: string;
  name: string;
  parameters: readonly string[];
}

interface SourceTransform {
  pattern: RegExp;
  procedure: SourceProcedure;
  replace: (...matches: string[]) => string;
}

const numberSource = String.raw`-?(?:\d+(?:\.\d+)?|\.\d+)`;
const colorSource = String.raw`#?[0-9a-f]{6}`;

const sourceTransforms: readonly SourceTransform[] = [
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown cube (${numberSource}) (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body: "push penup setpos :x :y pendown cube :size :depth pop",
      name: "place_cube",
      parameters: ["x", "y", "size", "depth"],
    },
    replace: (_match, x, y, size, depth) =>
      `place_cube ${x} ${y} ${size} ${depth}`,
  },
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown sphere (${numberSource}) (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body: "push penup setpos :x :y pendown sphere :radius :detail pop",
      name: "place_sphere",
      parameters: ["x", "y", "radius", "detail"],
    },
    replace: (_match, x, y, radius, detail) =>
      `place_sphere ${x} ${y} ${radius} ${detail}`,
  },
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown star (${numberSource}) (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body: "push penup setpos :x :y pendown star :points :radius pop",
      name: "place_star",
      parameters: ["x", "y", "points", "radius"],
    },
    replace: (_match, x, y, points, radius) =>
      `place_star ${x} ${y} ${points} ${radius}`,
  },
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown ellipse (${numberSource}) (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body: "push penup setpos :x :y pendown ellipse :radiusx :radiusy pop",
      name: "place_ellipse",
      parameters: ["x", "y", "radiusx", "radiusy"],
    },
    replace: (_match, x, y, radiusX, radiusY) =>
      `place_ellipse ${x} ${y} ${radiusX} ${radiusY}`,
  },
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown dot (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body: "push penup setpos :x :y pendown dot :size pop",
      name: "place_dot",
      parameters: ["x", "y", "size"],
    },
    replace: (_match, x, y, size) => `place_dot ${x} ${y} ${size}`,
  },
  {
    pattern: new RegExp(
      `push penup fd (${numberSource}) pendown sphere (${numberSource}) (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body:
        "push penup fd :distance pendown sphere :radius :detail pop",
      name: "orbit_sphere",
      parameters: ["distance", "radius", "detail"],
    },
    replace: (_match, distance, radius, detail) =>
      `orbit_sphere ${distance} ${radius} ${detail}`,
  },
  {
    pattern: new RegExp(
      `push penup fd (${numberSource}) pendown dot (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body: "push penup fd :distance pendown dot :size pop",
      name: "orbit_dot",
      parameters: ["distance", "size"],
    },
    replace: (_match, distance, size) => `orbit_dot ${distance} ${size}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[orbit_dot (${numberSource}) (${numberSource}) tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [orbit_dot :distance :size tr :turn]",
      name: "dot_ring",
      parameters: ["count", "distance", "size", "turn"],
    },
    replace: (_match, count, distance, size, turn) =>
      `dot_ring ${count} ${distance} ${size} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[orbit_sphere (${numberSource}) (${numberSource}) (${numberSource}) tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [orbit_sphere :distance :radius :detail tr :turn]",
      name: "sphere_orbit",
      parameters: ["count", "distance", "radius", "detail", "turn"],
    },
    replace: (_match, count, distance, radius, detail, turn) =>
      `sphere_orbit ${count} ${distance} ${radius} ${detail} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[push penup fd (${numberSource}) pendown spray (${numberSource}) (${numberSource}) pop tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [push penup fd :distance pendown spray :radius :density pop tr :turn]",
      name: "spray_orbit",
      parameters: [
        "count",
        "distance",
        "radius",
        "density",
        "turn",
      ],
    },
    replace: (_match, count, distance, radius, density, turn) =>
      `spray_orbit ${count} ${distance} ${radius} ${density} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[ellipse (${numberSource}) (${numberSource}) tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [ellipse :radiusx :radiusy tr :turn]",
      name: "ellipse_ring",
      parameters: ["count", "radiusx", "radiusy", "turn"],
    },
    replace: (_match, count, radiusX, radiusY, turn) =>
      `ellipse_ring ${count} ${radiusX} ${radiusY} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[sphere (${numberSource}) (${numberSource}) tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [sphere :radius :detail tr :turn]",
      name: "sphere_ring",
      parameters: ["count", "radius", "detail", "turn"],
    },
    replace: (_match, count, radius, detail, turn) =>
      `sphere_ring ${count} ${radius} ${detail} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[star (${numberSource}) (${numberSource}) tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [star :points :radius tr :turn]",
      name: "star_ring",
      parameters: ["count", "points", "radius", "turn"],
    },
    replace: (_match, count, points, radius, turn) =>
      `star_ring ${count} ${points} ${radius} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[circle (${numberSource}) tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body: "repeat :count [circle :radius tr :turn]",
      name: "circle_ring",
      parameters: ["count", "radius", "turn"],
    },
    replace: (_match, count, radius, turn) =>
      `circle_ring ${count} ${radius} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[arc (${numberSource}) (${numberSource}) tr (${numberSource})\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [arc :angle :radius tr :turn]",
      name: "arc_ring",
      parameters: ["count", "angle", "radius", "turn"],
    },
    replace: (_match, count, angle, radius, turn) =>
      `arc_ring ${count} ${angle} ${radius} ${turn}`,
  },
  {
    pattern: new RegExp(
      `repeat 4 \\[fd (${numberSource}) tr 90\\]`,
      "gu",
    ),
    procedure: {
      body: "repeat 4 [fd :size tr 90]",
      name: "square",
      parameters: ["size"],
    },
    replace: (_match, size) => `square ${size}`,
  },
  {
    pattern: new RegExp(
      `repeat 3 \\[fd (${numberSource}) tr 120\\]`,
      "gu",
    ),
    procedure: {
      body: "repeat 3 [fd :size tr 120]",
      name: "triangle",
      parameters: ["size"],
    },
    replace: (_match, size) => `triangle ${size}`,
  },
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown seth (${numberSource}) grid3d (${numberSource}) (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body:
        "push penup setpos :x :y pendown seth :heading grid3d :size :divisions pop",
      name: "place_grid",
      parameters: ["x", "y", "heading", "size", "divisions"],
    },
    replace: (_match, x, y, heading, size, divisions) =>
      `place_grid ${x} ${y} ${heading} ${size} ${divisions}`,
  },
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown seth (${numberSource}) fd (${numberSource}) pop`,
      "gu",
    ),
    procedure: {
      body:
        "push penup setpos :x :y pendown seth :heading fd :distance pop",
      name: "place_line",
      parameters: ["x", "y", "heading", "distance"],
    },
    replace: (_match, x, y, heading, distance) =>
      `place_line ${x} ${y} ${heading} ${distance}`,
  },
  {
    pattern: new RegExp(
      `push penup setpos (${numberSource}) (${numberSource}) pendown repeat (${numberSource}) \\[cube (${numberSource}) (${numberSource}) penup fd (${numberSource}) pendown\\] pop`,
      "gu",
    ),
    procedure: {
      body:
        "push penup setpos :x :y pendown repeat :count [cube :size :depth penup fd :step pendown] pop",
      name: "place_cube_row",
      parameters: ["x", "y", "count", "size", "depth", "step"],
    },
    replace: (_match, x, y, count, size, depth, step) =>
      `place_cube_row ${x} ${y} ${count} ${size} ${depth} ${step}`,
  },
  {
    pattern: new RegExp(
      `repeat (${numberSource}) \\[cube (${numberSource}) (${numberSource}) penup fd (${numberSource}) pendown\\]`,
      "gu",
    ),
    procedure: {
      body:
        "repeat :count [cube :size :depth penup fd :step pendown]",
      name: "cube_row",
      parameters: ["count", "size", "depth", "step"],
    },
    replace: (_match, count, size, depth, step) =>
      `cube_row ${count} ${size} ${depth} ${step}`,
  },
  {
    pattern: new RegExp(
      `gradientbg (${colorSource}) (${colorSource}) (${numberSource}) hideturtle`,
      "gu",
    ),
    procedure: {
      body: "gradientbg :color1 :color2 :angle hideturtle",
      name: "start_scene",
      parameters: ["color1", "color2", "angle"],
    },
    replace: (_match, color1, color2, angle) =>
      `start_scene ${color1} ${color2} ${angle}`,
  },
  {
    pattern: new RegExp(
      `setbc (${colorSource}) hideturtle`,
      "gu",
    ),
    procedure: {
      body: "setbc :color hideturtle",
      name: "start_solid_scene",
      parameters: ["color"],
    },
    replace: (_match, color) => `start_solid_scene ${color}`,
  },
  {
    pattern: new RegExp(
      `penup setpos (${numberSource}) (${numberSource}) pendown`,
      "gu",
    ),
    procedure: {
      body: "penup setpos :x :y pendown",
      name: "move_to",
      parameters: ["x", "y"],
    },
    replace: (_match, x, y) => `move_to ${x} ${y}`,
  },
  {
    pattern: new RegExp(
      `penup fd (${numberSource}) pendown`,
      "gu",
    ),
    procedure: {
      body: "penup fd :distance pendown",
      name: "move_forward",
      parameters: ["distance"],
    },
    replace: (_match, distance) => `move_forward ${distance}`,
  },
  {
    pattern:
      /setblend source-over setalpha 1 setglow 0/gu,
    procedure: {
      body: "setblend source-over setalpha 1 setglow 0",
      name: "reset_light",
      parameters: [],
    },
    replace: () => "reset_light",
  },
  {
    pattern:
      /setsoftness 0 setflow 1 setsymmetry 1/gu,
    procedure: {
      body: "setsoftness 0 setflow 1 setsymmetry 1",
      name: "reset_brush",
      parameters: [],
    },
    replace: () => "reset_brush",
  },
] as const;

const simplifyLogoSource = (
  source: string,
): {
  procedures: readonly SourceProcedure[];
  source: string;
} => {
  const procedures: SourceProcedure[] = [];
  let simplifiedSource = source;

  sourceTransforms.forEach(({ pattern, procedure, replace }) => {
    pattern.lastIndex = 0;
    if (pattern.test(simplifiedSource)) {
      pattern.lastIndex = 0;
      simplifiedSource = simplifiedSource.replace(pattern, replace);
      procedures.push(procedure);
    }
  });

  return { procedures, source: simplifiedSource };
};

const serializeProcedure = (
  procedure: Readonly<SourceProcedure>,
): string => {
  const parameters = procedure.parameters
    .map((parameter) => ` :${parameter}`)
    .join("");
  return `to ${procedure.name}${parameters}\n  ${procedure.body}\nend`;
};

const scalableFirstArguments = new Set<ICommandModel["name"]>([
  "bk",
  "circle",
  "cube",
  "dot",
  "ellipse",
  "fd",
  "grid3d",
  "setradial",
  "sphere",
  "spray",
]);

const scalableSecondArguments = new Set<ICommandModel["name"]>([
  "arc",
  "cube",
  "ellipse",
  "fillpoly",
  "polygon",
  "spiral",
  "star",
]);

const twoNumberCommands = new Set<ICommandModel["name"]>([
  "arc",
  "cube",
  "ellipse",
  "fillpoly",
  "setdash",
  "setpos",
  "grid3d",
  "polygon",
  "sphere",
  "spray",
  "spiral",
  "star",
]);

const colorCommands = new Set<ICommandModel["name"]>(["setbc", "setsc"]);

const gradientCommands = new Set<ICommandModel["name"]>([
  "gradientbg",
  "setgradient",
  "setradial",
]);

const noArgumentCommands = new Set<ICommandModel["name"]>([
  "hideturtle",
  "home",
  "pendown",
  "penup",
  "pop",
  "push",
  "showturtle",
]);

const scaleCommand = (
  command: Readonly<ICommandModel>,
  scale: number,
): ICommandModel => ({
  ...command,
  ...(scalableFirstArguments.has(command.name) &&
  command.value !== undefined
    ? { value: round(command.value * scale) }
    : {}),
  ...(scalableSecondArguments.has(command.name) &&
  command.arg2 !== undefined
    ? { arg2: round(command.arg2 * scale) }
    : {}),
  ...(command.commands
    ? {
        commands: command.commands.map((nestedCommand) =>
          scaleCommand(nestedCommand, scale),
        ),
      }
    : {}),
});

const serializeDefaultArgument = (
  command: Readonly<ICommandModel>,
): string | number => {
  if (command.palette !== undefined) {
    return command.palette.map((color) => color.replace("#", "")).join(" ");
  }
  return command.blend ?? command.value ?? 0;
};

const serializeAnimation = (
  animation: NonNullable<ICommandModel["animation"]>,
): string => {
  const cycle =
    animation.mode === "once"
      ? ""
      : ` ${animation.mode} ${animation.cycles}`;
  return `anim[${animation.start} ${animation.finish} ${animation.durationMs} ${animation.easing}${cycle}]`;
};

const getSerializedProperty = (
  command: Readonly<ICommandModel>,
  property: "arg2" | "depth" | "height" | "rotation" | "value" | "width",
  fallback: number,
): string | number => {
  if (command.animation?.property === property) {
    return serializeAnimation(command.animation);
  }

  const animation = command.animations?.find(
    (candidate) => candidate.property === property,
  );
  if (animation !== undefined) {
    return serializeAnimation(animation);
  }

  return command[property] ?? fallback;
};

const getSerializedDefaultArgument = (
  command: Readonly<ICommandModel>,
): string | number => {
  if (command.animation?.property === "value") {
    return serializeAnimation(command.animation);
  }
  return serializeDefaultArgument(command);
};

const serializeCubeCommand = (
  command: Readonly<ICommandModel>,
): string => {
  if (command.animations === undefined) {
    const rotation =
      command.animation?.property === "rotation"
        ? ` ${serializeAnimation(command.animation)}`
        : "";
    return `cube ${command.value ?? 220} ${command.arg2 ?? 90}${rotation}`;
  }

  return [
    "cube",
    "width",
    getSerializedProperty(command, "width", command.value ?? 220),
    "height",
    getSerializedProperty(command, "height", command.value ?? 220),
    "depth",
    getSerializedProperty(command, "depth", command.arg2 ?? 90),
    "rotation",
    getSerializedProperty(command, "rotation", 0),
  ].join(" ");
};

const serializeCommand = (command: Readonly<ICommandModel>): string => {
  if (command.name === "repeat") {
    const nestedCommands = command.commands
      ?.map((nestedCommand) => serializeCommand(nestedCommand))
      .join(" ");
    return `repeat ${command.value ?? 0} [${nestedCommands ?? ""}]`;
  }

  if (command.name === "cube") {
    return serializeCubeCommand(command);
  }

  if (twoNumberCommands.has(command.name)) {
    return `${command.name} ${getSerializedProperty(command, "value", 0)} ${getSerializedProperty(command, "arg2", 0)}`;
  }

  if (colorCommands.has(command.name)) {
    return `${command.name} ${command.color?.replace("#", "") ?? "000000"}`;
  }

  if (gradientCommands.has(command.name)) {
    const color1 = command.color?.replace("#", "") ?? "000000";
    const color2 = command.color2?.replace("#", "") ?? "ffffff";
    return `${command.name} ${color1} ${color2} ${getSerializedProperty(command, "value", 0)}`;
  }

  if (noArgumentCommands.has(command.name)) {
    return command.name;
  }

  return `${command.name} ${getSerializedDefaultArgument(command)}`;
};

const example = ({
  scale = 1,
  source,
  start,
  ...spec
}: ExampleSpec): IPathwayExample => {
  const parsedCommands = new Parser(source).parse(() => {
    throw new Error(`Invalid bundled example: ${spec.type} / ${spec.name}`);
  });

  if (parsedCommands.length !== 1) {
    throw new Error(
      `Bundled example must contain one root command: ${spec.type} / ${spec.name}`,
    );
  }

  const scaledCommand = scaleCommand(parsedCommands[0], scale);
  const command =
    start === undefined
      ? scaledCommand
      : {
          id: 0,
          name: "repeat" as const,
          value: 1,
          commands: [
            { id: 0, name: "penup" as const },
            {
              id: 0,
              name: "setpos" as const,
              value: start[0],
              arg2: start[1],
            },
            { id: 0, name: "pendown" as const },
            scaledCommand,
          ],
        };

  const procedureName = getProcedureName(spec.name);
  const simplified = simplifyLogoSource(serializeCommand(command));
  const helperProcedures = simplified.procedures.map(serializeProcedure);
  const path = [
    ...helperProcedures,
    `to ${procedureName}`,
    `  ${simplified.source}`,
    "end",
    procedureName,
  ].join("\n");
  const procedureProgram = new Parser(path).parseProgram(() => {
    throw new Error(
      `Invalid generated procedure example: ${spec.type} / ${spec.name}`,
    );
  });
  if (procedureProgram.commands.length !== 1) {
    throw new Error(
      `Generated procedure example must contain one root command: ${spec.type} / ${spec.name}`,
    );
  }
  if (
    serializeCommand(procedureProgram.commands[0]) !==
    serializeCommand(command)
  ) {
    throw new Error(
      `Generated procedures changed the example output: ${spec.type} / ${spec.name}`,
    );
  }

  return {
    ...spec,
    command: procedureProgram.commands[0],
    path,
    procedures: procedureProgram.procedures,
  };
};

const scanlineCommands = biohazardScanlines
  .flatMap(([y, ...segments]) =>
    segments.map(([x, length]) => `setpos ${x} ${y} fd ${length}`),
  )
  .join(" ");

export const exampleCollections: readonly IExampleCollection[] = [
  {
    id: "showstoppers",
    label: "Showstoppers",
    description:
      "Dense, surprising compositions that reveal how far commands can go.",
  },
  {
    id: "motion",
    label: "Motion studio",
    description:
      "Load living scenes with synchronized easing, loops, morphs, and multi-track animation.",
  },
  {
    id: "performance",
    label: "Performance lab",
    description:
      "Beautiful stress scenes for measuring paths, particles, brushes, and geometry.",
  },
  {
    id: "symbols",
    label: "Icons & symbols",
    description:
      "Recreate signs and emblems people recognize at a glance.",
  },
  {
    id: "first-steps",
    label: "First steps",
    description:
      "Learn movement, turning, positioning, headings, and pen control.",
  },
  {
    id: "geometry",
    label: "Geometry",
    description:
      "Compose arcs, ellipses, polygons, stars, dots, and spirals.",
  },
  {
    id: "depth",
    label: "Depth & perspective",
    description:
      "Build wireframe cubes, globes, and perspective-grid scenes.",
  },
  {
    id: "color-light",
    label: "Color & light",
    description:
      "Explore palettes, gradients, opacity, glow, and blend modes.",
  },
  {
    id: "brushes-particles",
    label: "Brushes & particles",
    description:
      "Paint with soft brushes, controlled flow, and repeatable sprays.",
  },
  {
    id: "generative-systems",
    label: "Generative systems",
    description:
      "Combine symmetry, state stacks, and nested repetition.",
  },
];

export const pathwayExamples: readonly IPathwayExample[] = [
  example({
    name: "Neon singularity",
    source:
      "repeat 1 [gradientbg 02030a 1e1b4b 45 hideturtle setblend screen setalpha .5 setglow 20 setsw 5 setpalette ff4d9d ff9f1c 38bdf8 a78bfa repeat 72 [ellipse 285 58 tr 5] setalpha .28 setseed 731 setsymmetry 12 spray 330 180 setsymmetry 1 setblend source-over setalpha 1 setglow 0 setsc 02030a fillpoly 48 105 setgradient fef3c7 f97316 0 setsw 10 ellipse 138 34]",
    image: "neon-singularity.png",
    type: "showstoppers",
  }),
  example({
    name: "Quantum rose engine",
    source:
      "repeat 1 [gradientbg 030712 240046 90 hideturtle setblend lighter setalpha .48 setglow 16 setsw 3 setpalette ff006e 8338ec 3a86ff 00f5d4 fee440 repeat 36 [star 7 245 tr 10 ellipse 178 58 tr 5] setblend screen setalpha .7 setradial ffffff ff006e 95 fillpoly 18 82 setblend source-over setalpha 1 setglow 0]",
    image: "quantum-rose-engine.png",
    type: "showstoppers",
  }),
  example({
    name: "Crystal city",
    source:
      "repeat 1 [gradientbg 020617 172554 90 hideturtle setblend screen setgradient 22d3ee c084fc 45 setglow 14 setsw 3 push penup setpos 400 235 pendown seth 0 grid3d 315 16 pop repeat 16 [tr 22.5 push penup fd 245 pendown cube 108 72 sphere 42 6 pop] setradial ffffff 38bdf8 125 sphere 112 12 setblend source-over setglow 0]",
    image: "crystal-city.png",
    type: "showstoppers",
  }),
  example({
    name: "Fractal lightning garden",
    source:
      "repeat 1 [gradientbg 020617 111827 90 hideturtle setblend screen setgradient 67e8f9 a78bfa 45 setglow 15 setsw 4 repeat 16 [tr 22.5 push fd 65 repeat 6 [push tl 34 fd 58 setsw 7 fd 30 dot 15 pop push tr 34 fd 58 setsw 3 fd 44 dot 11 pop fd 24] pop] setblend source-over setglow 0]",
    image: "fractal-lightning-garden.png",
    type: "showstoppers",
  }),
  example({
    name: "Hypercube reactor",
    source:
      "repeat 1 [gradientbg 050816 1e1b4b 45 hideturtle setblend lighter setgradient 00f5d4 ff006e 35 setglow 20 setsw 3 repeat 24 [tr 15 push penup fd 205 pendown seth 45 cube 138 92 pop] setalpha .7 sphere 155 14 setalpha .35 setdash 8 9 repeat 18 [ellipse 285 95 tr 10] setdash 0 0 setblend source-over setalpha 1 setglow 0]",
    image: "hypercube-reactor.png",
    type: "showstoppers",
  }),
  example({
    name: "Aurora supernova",
    source:
      "repeat 1 [gradientbg 020617 312e81 90 hideturtle setblend screen setsymmetry 12 setalpha .55 setsc 67e8f9 setsw 44 setsoftness .9 setflow .12 repeat 3 [fd 175 bk 175 tr 10] setalpha .5 setsc f0abfc setsw 28 setflow .18 repeat 2 [fd 125 dot 42 bk 125 tr 15] setsoftness 0 setflow 1 setalpha .85 setgradient fef08a f472b6 45 setsw 2 star 24 245 setsymmetry 1 setblend source-over setalpha 1]",
    image: "aurora-supernova.png",
    type: "showstoppers",
  }),
  example({
    name: "Eye of the cosmos",
    source:
      "repeat 1 [gradientbg 02030a 1d1135 0 hideturtle setblend screen setglow 22 setalpha .62 setpalette 38bdf8 a78bfa f472b6 repeat 36 [ellipse 285 112 tr 5] setalpha .85 setradial ffffff 3a86ff 145 fillpoly 48 138 setblend source-over setsc 02030a fillpoly 48 58 setsc ffffff dot 24 setblend lighter setalpha .75 repeat 36 [push penup fd 205 pendown dot 9 pop tr 10] setblend source-over setalpha 1 setglow 0]",
    image: "eye-of-the-cosmos.png",
    type: "showstoppers",
  }),
  example({
    name: "Celestial clockwork",
    source:
      "repeat 1 [gradientbg 071013 172554 45 hideturtle setblend screen setglow 12 setpalette ffb703 06d6a0 3a86ff f72585 setsw 4 repeat 36 [push penup fd 238 pendown polygon 8 34 star 8 25 pop tr 10] setgradient fef3c7 f59e0b 0 setsw 7 circle 190 setdash 12 8 circle 145 setdash 0 0 setalpha .65 repeat 24 [push penup fd 112 pendown dot 16 pop tr 15] setalpha 1 setradial ffffff f59e0b 70 fillpoly 24 66 setblend source-over setglow 0]",
    image: "celestial-clockwork.png",
    type: "showstoppers",
  }),
  example({
    name: "Kinetic neon orrery",
    source:
      "repeat 1 [gradientbg 02030a 20104f anim[0 180 10000 linear repeat infinite] hideturtle setblend screen setalpha .58 setglow anim[8 24 2400 ease-in-out pingpong infinite] setsw 3 setpalette 22d3ee 818cf8 e879f9 fbbf24 tr anim[0 360 12000 linear repeat infinite] repeat 12 [push penup fd 225 pendown ellipse anim[24 72 2200 ease-in-out pingpong infinite] 15 sphere anim[12 29 1800 ease-in-out pingpong infinite] 7 pop tr 30] setradial ffffff 38bdf8 anim[45 110 2600 ease-in-out pingpong infinite] sphere anim[55 94 2600 ease-in-out pingpong infinite] 14 setalpha .32 setdash 8 10 ellipse anim[155 285 4200 ease-in-out pingpong infinite] anim[42 118 3100 ease-in-out pingpong infinite]]",
    image: "kinetic-neon-orrery.png",
    type: "motion",
    animationFocus: "Synchronized orbit",
  }),
  example({
    name: "Morphing hypercube array",
    source:
      "repeat 1 [gradientbg 020617 240046 anim[25 155 9000 linear repeat infinite] hideturtle setblend lighter setalpha .52 setglow 18 setsw 3 setgradient 22d3ee e879f9 anim[0 180 7000 linear repeat infinite] cube width anim[105 275 2800 ease-in-out pingpong infinite] height anim[260 95 2200 ease-in-out pingpong infinite] depth anim[35 150 3400 ease-in-out pingpong infinite] rotation anim[0 360 6000 linear repeat infinite] setalpha .28 setglow 10 repeat 8 [tr 45 push penup fd 245 pendown cube width anim[42 105 1900 ease-in-out pingpong infinite] height anim[108 38 2500 ease-in-out pingpong infinite] depth anim[20 74 2100 ease-in-out pingpong infinite] rotation anim[360 0 4300 linear repeat infinite] pop] setradial ffffff 818cf8 72 sphere anim[28 66 1800 ease-in-out pingpong infinite] 10]",
    image: "morphing-hypercube-array.png",
    type: "motion",
    animationFocus: "Four-track morph",
  }),
  example({
    name: "Chromatic tidal bloom",
    source:
      "repeat 1 [gradientbg 030712 172554 anim[0 180 11000 linear repeat infinite] hideturtle setblend screen setalpha anim[.22 .68 2600 ease-in-out pingpong infinite] setglow anim[6 22 2600 ease-in-out pingpong infinite] setsw anim[1.2 4.5 2200 ease-in-out pingpong infinite] setpalette 22d3ee a78bfa f472b6 fbbf24 repeat 36 [ellipse anim[65 285 4200 ease-in-out pingpong infinite] anim[16 105 3100 ease-in-out pingpong infinite] tr 10] setalpha .72 setradial ffffff f472b6 anim[45 105 2400 ease-in-out pingpong infinite] fillpoly 24 anim[38 88 2400 ease-in-out pingpong infinite] setblend lighter setalpha .34 tr anim[0 360 8500 linear repeat infinite] star 18 anim[115 275 3600 ease-in-out pingpong infinite]]",
    image: "chromatic-tidal-bloom.png",
    type: "motion",
    animationFocus: "Breathing geometry",
  }),
  example({
    name: "Particle pulse reactor",
    source:
      "repeat 1 [gradientbg 02030a 111827 90 hideturtle setseed 202607 setblend screen setsymmetry 16 setalpha anim[.12 .48 1800 ease-in-out pingpong infinite] setflow .55 setglow anim[3 18 1800 ease-in-out pingpong infinite] setpalette 22d3ee 818cf8 e879f9 f472b6 spray anim[35 240 3000 ease-in-out pingpong infinite] 480 setsymmetry 8 setalpha .6 tr anim[0 360 7200 linear repeat infinite] repeat 8 [push penup fd 145 pendown spray anim[18 58 2100 ease-in-out pingpong infinite] 220 dot anim[5 20 1600 ease-in-out pingpong infinite] pop tr 45] setsymmetry 1 setradial ffffff fbbf24 anim[30 78 1800 ease-in-out pingpong infinite] fillpoly 24 anim[22 60 1800 ease-in-out pingpong infinite]]",
    image: "particle-pulse-reactor.png",
    type: "motion",
    animationFocus: "Particle heartbeat",
  }),
  example({
    name: "Lissajous signal garden",
    source:
      "repeat 1 [gradientbg 020617 1e1b4b anim[45 135 8000 ease-in-out pingpong infinite] hideturtle setblend screen setglow 20 setsw 3 setpalette 67e8f9 a78bfa f472b6 fef08a push penup setpos anim[150 650 4200 ease-in-out pingpong infinite] anim[260 540 2800 ease-in-out pingpong infinite] pendown star 12 anim[38 92 2100 ease-in-out pingpong infinite] sphere anim[25 58 1700 ease-in-out pingpong infinite] 8 pop push penup setpos anim[650 150 3500 ease-in-out pingpong infinite] anim[540 260 4900 ease-in-out pingpong infinite] pendown ellipse anim[42 120 2400 ease-in-out pingpong infinite] anim[18 66 3100 ease-in-out pingpong infinite] dot anim[8 28 1500 ease-in-out pingpong infinite] pop setalpha .28 setdash 7 11 tr anim[0 360 9000 linear repeat infinite] repeat 18 [ellipse anim[100 310 5200 ease-in-out pingpong infinite] 42 tr 10]]",
    image: "lissajous-signal-garden.png",
    type: "motion",
    animationFocus: "Dual-axis motion",
  }),
  example({
    name: "Quantum compass engine",
    source:
      "repeat 1 [gradientbg 030712 172554 90 hideturtle setblend lighter setgradient 22d3ee e879f9 anim[0 360 10000 linear repeat infinite] setglow anim[8 20 2600 ease-in-out pingpong infinite] setsw 3 seth anim[0 360 12000 linear repeat infinite] repeat 24 [push penup fd anim[95 255 3600 ease-in-out pingpong infinite] pendown star 8 anim[16 46 2200 ease-in-out pingpong infinite] dot anim[4 14 1400 ease-in-out pingpong infinite] pop tr 15] setalpha .42 setdash anim[2 18 2400 ease-in-out pingpong infinite] anim[18 3 2400 ease-in-out pingpong infinite] circle anim[105 235 3600 ease-in-out pingpong infinite] setdash 0 0 setalpha .8 setradial ffffff 38bdf8 anim[32 86 2200 ease-in-out pingpong infinite] polygon 12 anim[28 72 2200 ease-in-out pingpong infinite]]",
    image: "quantum-compass-engine.png",
    type: "motion",
    animationFocus: "Radial choreography",
  }),
  example({
    name: "Liquid spiral clock",
    source:
      "repeat 1 [gradientbg 02030a 240046 anim[0 180 12000 linear repeat infinite] hideturtle setblend screen setalpha .48 setglow anim[5 19 2300 ease-in-out pingpong infinite] setsw anim[1 5 2300 ease-in-out pingpong infinite] setpalette 22d3ee 818cf8 e879f9 fb7185 fbbf24 tr anim[0 360 15000 linear repeat infinite] repeat 12 [push penup fd 150 pendown spiral anim[-2.5 5.5 4200 ease-in-out pingpong infinite] anim[2 9 2700 ease-in-out pingpong infinite] pop tr 30] setalpha .62 repeat 18 [ellipse anim[78 260 4400 ease-in-out pingpong infinite] anim[18 72 3300 ease-in-out pingpong infinite] tr 10] setradial ffffff f472b6 anim[38 92 2500 ease-in-out pingpong infinite] dot anim[22 70 2500 ease-in-out pingpong infinite]]",
    image: "liquid-spiral-clock.png",
    type: "motion",
    animationFocus: "Counter-rotation",
  }),
  example({
    name: "Breathing crystal skyline",
    source:
      "repeat 1 [gradientbg 020617 172554 anim[45 135 9500 linear repeat infinite] hideturtle setblend screen setalpha .24 setglow 7 setgradient 22d3ee 818cf8 anim[0 180 8000 linear repeat infinite] push penup setpos 400 255 pendown grid3d anim[190 365 4200 ease-in-out pingpong infinite] 28 pop setalpha .58 setglow anim[7 18 2400 ease-in-out pingpong infinite] repeat 8 [tr 45 push penup fd 220 pendown cube width anim[45 112 2200 ease-in-out pingpong infinite] height anim[125 42 2900 ease-in-out pingpong infinite] depth anim[25 82 2500 ease-in-out pingpong infinite] rotation anim[0 360 6200 linear repeat infinite] pop] setalpha .75 setradial ffffff 38bdf8 anim[42 105 2600 ease-in-out pingpong infinite] sphere anim[38 82 2600 ease-in-out pingpong infinite] 12]",
    image: "breathing-crystal-skyline.png",
    type: "motion",
    animationFocus: "Living 3D scene",
  }),
  example({
    name: "Infinite prism reactor",
    source:
      "repeat 1 [gradientbg 02030a 240046 anim[0 360 12000 linear repeat infinite] hideturtle setseed 7314 setblend screen setsc 94a3b8 setalpha anim[.08 .22 4000 ease-in-out pingpong infinite] spray anim[280 390 3200 ease-in-out pingpong infinite] anim[500 1100 2400 ease-in-out pingpong infinite] setalpha .28 setgradient 00f5d4 ff006e anim[0 360 6000 linear repeat infinite] setglow anim[8 30 1800 ease-in-out pingpong infinite] setsw anim[1 4 1400 ease-in-out pingpong infinite] push penup setpos 400 400 pendown seth anim[0 360 9000 linear repeat infinite] repeat 12 [ellipse anim[120 310 3000 ease-in-out pingpong infinite] anim[28 105 1900 ease-in-out pingpong infinite] tr 30] pop setalpha .18 setgradient fbbf24 818cf8 anim[360 0 7000 linear repeat infinite] push penup setpos 400 400 pendown seth anim[360 0 11000 linear repeat infinite] repeat 9 [star anim[5 11 2600 ease-in-out pingpong infinite] anim[120 230 3400 ease-in-out pingpong infinite] tr 40] pop setalpha .55 setgradient 22d3ee e879f9 anim[0 360 4200 linear repeat infinite] push penup setpos 400 400 pendown seth anim[0 360 8000 linear repeat infinite] repeat 16 [push penup fd anim[140 245 2200 ease-in-out pingpong infinite] pendown cube width anim[25 72 1500 ease-in-out pingpong infinite] height anim[78 30 1900 ease-in-out pingpong infinite] depth anim[18 55 1700 ease-in-out pingpong infinite] rotation anim[0 360 2400 linear repeat infinite] pop tr 22.5] pop setalpha .82 setradial ffffff 22d3ee anim[60 165 1800 ease-in-out pingpong infinite] fillpoly anim[6 20 2600 ease-in-out pingpong infinite] anim[45 105 1500 ease-in-out pingpong infinite] setalpha .62 setgradient ffffff 818cf8 anim[0 360 3000 linear repeat infinite] sphere anim[72 138 2100 ease-in-out pingpong infinite] 18 setalpha .9 setgradient fef08a f472b6 anim[360 0 2200 linear repeat infinite] star anim[8 24 1800 ease-in-out pingpong infinite] anim[32 82 1300 ease-in-out pingpong infinite] setblend source-over setalpha 1 setglow 0]",
    image: "infinite-prism-reactor.png",
    type: "motion",
    animationFocus: "Layered motion system",
  }),
  example({
    name: "Nebula cube carousel",
    source:
      "repeat 1 [gradientbg 020617 312e81 anim[0 180 6000 linear pingpong infinite] hideturtle setseed 42 setblend screen setalpha .16 setsc ffffff spray anim[260 390 2800 ease-in-out pingpong infinite] anim[350 850 2200 ease-in-out pingpong infinite] setalpha .7 setgradient 22d3ee e879f9 anim[0 360 5000 linear repeat infinite] setsw anim[1 5 1400 ease-in-out pingpong infinite] setglow anim[8 28 1800 ease-in-out pingpong infinite] push penup setpos 400 400 pendown seth anim[0 360 7000 linear repeat infinite] ellipse anim[170 300 2400 ease-in-out pingpong infinite] anim[45 115 1700 ease-in-out pingpong infinite] pop push penup setpos 400 400 pendown seth anim[0 360 9000 linear repeat infinite] repeat 12 [push penup fd anim[150 265 2200 ease-in-out pingpong infinite] pendown cube width anim[35 85 1500 ease-in-out pingpong infinite] height anim[85 35 1900 ease-in-out pingpong infinite] depth anim[20 60 1700 ease-in-out pingpong infinite] rotation anim[0 360 2600 linear repeat infinite] pop tr 30] pop push penup setpos 400 400 pendown setradial ffffff 22d3ee anim[70 150 1800 ease-in-out pingpong infinite] sphere anim[65 125 2100 ease-in-out pingpong infinite] 16 pop setblend source-over setalpha 1 setglow 0]",
    image: "nebula-cube-carousel.png",
    type: "motion",
    animationFocus: "Orbital cube swarm",
  }),
  example({
    name: "Radial escape sequence",
    source:
      "repeat 1 [gradientbg 020617 0f172a anim[35 145 9000 ease-in-out pingpong infinite] hideturtle setseed 8088 setblend screen setalpha .18 setsc 94a3b8 spray anim[20 390 3000 ease-out repeat infinite] anim[160 820 2400 ease-out repeat infinite] setalpha .52 setgradient 22d3ee e879f9 anim[0 360 7000 linear repeat infinite] setglow anim[6 22 1900 ease-in-out pingpong infinite] setsw anim[1 4 1500 ease-in-out pingpong infinite] seth anim[0 360 16000 linear repeat infinite] repeat 16 [push penup fd anim[0 330 2800 ease-out repeat infinite] pendown cube width anim[12 58 2800 ease-out repeat infinite] height anim[18 72 2800 ease-out repeat infinite] depth anim[8 42 2800 ease-out repeat infinite] rotation anim[0 360 2800 linear repeat infinite] dot anim[3 14 2800 ease-out repeat infinite] pop tr 22.5] setalpha .7 setgradient fef08a f472b6 anim[0 360 5000 linear repeat infinite] push penup setpos anim[400 70 3100 ease-out repeat infinite] anim[400 90 3100 ease-out repeat infinite] pendown star 7 anim[5 42 3100 ease-out repeat infinite] pop setgradient 67e8f9 818cf8 anim[360 0 5600 linear repeat infinite] push penup setpos anim[400 730 3700 ease-out repeat infinite] anim[400 110 3700 ease-out repeat infinite] pendown polygon 8 anim[5 38 3700 ease-out repeat infinite] pop setgradient f472b6 fbbf24 anim[0 360 6200 linear repeat infinite] push penup setpos anim[400 710 4300 ease-out repeat infinite] anim[400 710 4300 ease-out repeat infinite] pendown star 9 anim[5 46 4300 ease-out repeat infinite] pop setgradient a78bfa 22d3ee anim[360 0 6800 linear repeat infinite] push penup setpos anim[400 85 4900 ease-out repeat infinite] anim[400 690 4900 ease-out repeat infinite] pendown sphere anim[6 44 4900 ease-out repeat infinite] 8 pop setalpha .3 setdash 7 12 push penup setpos 400 400 pendown circle anim[20 370 3200 ease-out repeat infinite] pop setdash 0 0 setblend source-over setalpha 1 setglow 0]",
    image: "radial-escape-sequence.png",
    type: "motion",
    animationFocus: "Center-to-edge launch",
  }),
  example({
    name: "Neon crosswind traffic",
    source:
      "repeat 1 [gradientbg 020617 18103a anim[25 155 10000 ease-in-out pingpong infinite] hideturtle setseed 517 setblend screen setalpha .22 setdash 10 16 setsw 2 setgradient 22d3ee 818cf8 anim[0 180 8000 linear repeat infinite] push penup setpos 30 145 pendown seth 0 fd 740 pop push penup setpos 30 285 pendown seth 0 fd 740 pop push penup setpos 30 430 pendown seth 0 fd 740 pop push penup setpos 30 590 pendown seth 0 fd 740 pop setdash 0 0 setalpha .72 setglow anim[7 22 1800 ease-in-out pingpong infinite] setgradient 22d3ee e879f9 anim[0 360 5400 linear repeat infinite] push penup setpos anim[-90 890 4600 ease-in-out repeat infinite] 145 pendown cube width anim[38 78 2100 ease-in-out pingpong infinite] height anim[82 36 1700 ease-in-out pingpong infinite] depth anim[22 58 1900 ease-in-out pingpong infinite] rotation anim[0 360 2600 linear repeat infinite] pop setgradient fef08a f472b6 anim[360 0 6100 linear repeat infinite] push penup setpos anim[890 -90 6200 ease-in-out repeat infinite] 285 pendown sphere anim[24 54 2100 ease-in-out pingpong infinite] 10 pop setgradient 67e8f9 a78bfa anim[0 360 4900 linear repeat infinite] push penup setpos anim[-100 900 5700 ease-in-out repeat infinite] 430 pendown seth anim[-35 35 1800 ease-in-out pingpong infinite] ellipse anim[28 78 2400 ease-in-out pingpong infinite] anim[12 32 1900 ease-in-out pingpong infinite] pop setgradient fbbf24 fb7185 anim[360 0 7200 linear repeat infinite] push penup setpos anim[900 -100 5100 ease-in-out repeat infinite] 590 pendown star 7 anim[18 48 1600 ease-in-out pingpong infinite] pop setgradient ffffff 38bdf8 anim[0 360 6600 linear repeat infinite] push penup setpos anim[-80 880 7000 ease-in-out repeat infinite] anim[730 70 7000 ease-in-out repeat infinite] pendown polygon 6 anim[16 46 2200 ease-in-out pingpong infinite] pop setgradient e879f9 22d3ee anim[360 0 5800 linear repeat infinite] push penup setpos 650 anim[-80 880 4300 ease-in-out repeat infinite] pendown cube width 42 height anim[24 76 1800 ease-in-out pingpong infinite] depth 34 rotation anim[0 360 2300 linear repeat infinite] pop setalpha .35 setsc 67e8f9 push penup setpos anim[-100 900 3900 linear repeat infinite] 720 pendown spray 42 180 pop setblend source-over setalpha 1 setglow 0]",
    image: "neon-crosswind-traffic.png",
    type: "motion",
    animationFocus: "Directional lane motion",
  }),
  example({
    name: "Galactica solar ballet",
    source:
      "repeat 1 [gradientbg 01030a 0f172a anim[0 90 18000 linear repeat infinite] hideturtle setseed 1977 setblend screen setalpha .32 setsc 94a3b8 spray 385 720 setalpha .2 setdash 5 10 setsw 1 setgradient 38bdf8 818cf8 anim[0 180 12000 linear repeat infinite] push penup setpos 400 400 pendown circle 62 circle 100 circle 145 circle 190 circle 245 circle 305 pop setdash 0 0 setalpha .5 setpalette 64748b 94a3b8 cbd5e1 repeat 48 [push penup fd 216 pendown dot 3 pop tr 7.5] setalpha 1 setblend lighter setglow anim[14 30 2200 ease-in-out pingpong infinite] push penup setpos 400 400 pendown setradial ffffff f97316 anim[38 72 2200 ease-in-out pingpong infinite] sphere anim[44 59 2200 ease-in-out pingpong infinite] 18 setalpha .45 setgradient fef08a f97316 anim[0 360 5000 linear repeat infinite] star 18 anim[54 72 2200 ease-in-out pingpong infinite] pop setglow 8 setalpha .9 push penup setpos 400 400 pendown seth anim[0 360 4000 linear repeat infinite] penup fd 62 pendown setradial f8fafc 64748b 12 sphere 8 7 pop push penup setpos 400 400 pendown seth anim[0 360 6500 linear repeat infinite] penup fd 100 pendown setradial fef3c7 f59e0b 18 sphere 13 9 pop push penup setpos 400 400 pendown seth anim[0 360 9000 linear repeat infinite] penup fd 145 pendown setradial ffffff 2563eb 21 sphere 16 11 setgradient 67e8f9 22c55e anim[0 360 4200 linear repeat infinite] ellipse 16 7 push seth anim[0 360 1800 linear repeat infinite] penup fd 27 pendown setradial f8fafc 94a3b8 7 sphere 5 5 pop pop push penup setpos 400 400 pendown seth anim[0 360 12000 linear repeat infinite] penup fd 190 pendown setradial fef2f2 dc2626 16 sphere 11 8 pop push penup setpos 400 400 pendown seth anim[0 360 18000 linear repeat infinite] penup fd 245 pendown setradial fef3c7 d97706 34 sphere 27 14 setalpha .55 setgradient fef08a f97316 0 ellipse 25 8 pop push penup setpos 400 400 pendown seth anim[0 360 24000 linear repeat infinite] penup fd 305 pendown setradial fef3c7 ca8a04 28 sphere 22 12 setalpha .7 setgradient fef3c7 a78bfa anim[0 360 7000 linear repeat infinite] setsw 3 ellipse 40 11 ellipse 48 14 pop setblend screen setalpha .88 setglow 22 setsw 5 setgradient ffffff 22d3ee 0 push penup setpos anim[-120 920 7200 ease-out repeat infinite] anim[90 610 7200 ease-out repeat infinite] pendown seth 27 star 5 13 bk 85 pop setalpha .72 setglow 16 setsw 4 setgradient fef3c7 f472b6 0 push penup setpos anim[930 -130 9200 ease-out repeat infinite] anim[140 700 9200 ease-out repeat infinite] pendown seth 152 star 5 10 bk 68 pop setalpha .66 setglow 14 setsw 3 setgradient ffffff a78bfa 90 push penup setpos 720 anim[-100 900 11000 ease-out repeat infinite] pendown seth 96 dot 12 bk 55 pop setglow 5 setalpha .7 setgradient cbd5e1 64748b anim[0 360 5000 linear repeat infinite] push penup setpos anim[-80 880 9800 linear repeat infinite] 245 pendown seth anim[0 360 2400 linear repeat infinite] fillpoly 7 11 pop push penup setpos anim[880 -80 12600 linear repeat infinite] 545 pendown seth anim[360 0 3100 linear repeat infinite] fillpoly 9 14 pop setblend source-over setalpha 1 setglow 0 setsw 2]",
    image: "galactica-solar-ballet.png",
    type: "motion",
    animationFocus: "Planets & comet flybys",
  }),
  example({
    name: "Prismatic thread reactor",
    source:
      "repeat 1 [gradientbg 03020c 190b3d 45 hideturtle setblend screen setalpha .13 setglow 3 setsw .75 setpalette 22d3ee 818cf8 e879f9 fb7185 fbbf24 repeat 240 [tr 1.5 push penup fd 220 pendown tr 68 repeat 720 [fd 1.05 tr .5] pop] setblend source-over setalpha 1 setglow 0]",
    image: "prismatic-thread-reactor.png",
    type: "performance",
    performanceFocus: "Path batching",
  }),
  example({
    name: "Particle halo furnace",
    source:
      "repeat 1 [gradientbg 020617 20104f 90 hideturtle setseed 2026 setblend screen setalpha .32 setsw 2 setflow .65 setsc 22d3ee setsymmetry 18 repeat 10 [push penup fd 210 pendown spray 52 620 pop tr 2] setsc a78bfa setsymmetry 12 setalpha .38 repeat 12 [push penup fd 125 pendown spray 48 520 pop tr 2.5] setsc f472b6 setsymmetry 8 setalpha .5 repeat 8 [push penup fd 62 pendown spray 38 420 pop tr 5] setsymmetry 1 setalpha .85 setglow 16 setradial ffffff fbbf24 46 fillpoly 24 42 setblend source-over setalpha 1 setglow 0]",
    image: "particle-halo-furnace.png",
    type: "performance",
    performanceFocus: "Particles × symmetry",
  }),
  example({
    name: "Velvet caustic bloom",
    source:
      "repeat 1 [gradientbg 02030a 172554 45 hideturtle setblend screen setalpha .45 setsymmetry 12 setsoftness .92 setflow .035 setglow 5 setsw 32 setsc 22d3ee repeat 32 [tr 1.17 push penup fd 150 pendown tr 58 repeat 44 [fd 10.5 tr 3.7] pop] setsw 24 setsc a78bfa repeat 36 [tr 1.43 push penup fd 215 pendown tr 76 repeat 52 [fd 8.7 tr 3.15] pop] setsw 18 setsc f472b6 repeat 42 [tr 1.71 push penup fd 100 pendown tr 42 repeat 38 [fd 9.2 tr 4.4] pop] setsoftness 0 setflow 1 setsymmetry 1 setblend source-over setalpha 1 setglow 0]",
    image: "velvet-caustic-bloom.png",
    type: "performance",
    performanceFocus: "Soft-brush gradients",
  }),
  example({
    name: "Orbital glass cathedral",
    source:
      "repeat 1 [gradientbg 020617 172554 90 hideturtle setblend screen setalpha .045 setglow 3 setsw .75 setgradient 22d3ee e879f9 45 repeat 144 [tr 2.5 push penup fd 170 pendown sphere 92 32 pop] setalpha .055 setgradient fbbf24 818cf8 135 repeat 120 [tr 3 push penup fd 255 pendown tr 45 cube 80 55 pop] setalpha .62 setglow 12 setradial ffffff 22d3ee 92 sphere 86 16 setalpha .7 setgradient fef3c7 e879f9 45 star 18 74 setblend source-over setalpha 1 setglow 0]",
    image: "orbital-glass-cathedral.png",
    type: "performance",
    performanceFocus: "Complex geometry",
  }),
  example({
    name: "Neon megacity canyon",
    source:
      "repeat 1 [gradientbg 020617 172554 90 hideturtle setblend screen setalpha .28 setglow 7 setsw 1 setgradient 22d3ee 818cf8 90 penup setpos 400 238 pendown seth 0 grid3d 365 64 setalpha .22 setgradient 22d3ee e879f9 45 repeat 5 [push penup setpos 270 285 pendown repeat 6 [cube 30 20 penup fd 52 pendown] pop push penup setpos 205 342 pendown repeat 8 [cube 40 27 penup fd 58 pendown] pop push penup setpos 125 415 pendown repeat 11 [cube 54 36 penup fd 62 pendown] pop push penup setpos 50 505 pendown repeat 13 [cube 72 48 penup fd 66 pendown] pop push penup setpos -20 620 pendown repeat 14 [cube 96 64 penup fd 70 pendown] pop tr .45] setalpha .5 setglow 14 setgradient fef08a f472b6 90 push penup setpos 120 465 pendown cube 115 78 pop push penup setpos 610 430 pendown cube 132 88 pop setblend source-over setalpha 1 setglow 0]",
    image: "neon-megacity-canyon.png",
    type: "performance",
    performanceFocus: "Layered 3D city",
  }),
  example({
    name: "Saturn forge shipyard",
    source:
      "repeat 1 [gradientbg 02030a 172554 45 hideturtle setseed 948 setblend screen setalpha .34 setsw 1 setsc 94a3b8 spray 390 900 penup setpos 540 315 pendown setalpha .065 setglow 4 setgradient 22d3ee a78bfa 35 repeat 360 [tr 1 push penup fd 238 pendown tr 45 cube 30 20 pop] setalpha .5 setglow 10 setgradient fef3c7 f97316 12 sphere 172 32 setalpha .34 setglow 7 setgradient 38bdf8 e879f9 35 setsw 3 repeat 9 [ellipse 265 74 tr 4] setalpha .72 setradial ffffff 38bdf8 56 push penup setpos 210 210 pendown sphere 48 16 pop setradial ffffff f472b6 38 push penup setpos 245 565 pendown sphere 31 12 pop setalpha .48 setgradient fef08a f97316 90 push penup setpos 115 610 pendown seth -18 grid3d 245 32 pop setblend source-over setalpha 1 setglow 0]",
    image: "saturn-forge-shipyard.png",
    type: "performance",
    performanceFocus: "Orbital 3D geometry",
  }),
  example({
    name: "Atlas construction mech",
    source:
      "repeat 1 [gradientbg 020617 111827 90 hideturtle setblend screen setalpha .22 setglow 5 setsw 1 setgradient 22d3ee 818cf8 90 push penup setpos 400 520 pendown seth 0 grid3d 360 48 pop seth 0 setalpha .09 setgradient 22d3ee e879f9 45 repeat 10 [push penup setpos 400 350 pendown cube 180 110 pop push penup setpos 435 205 pendown cube 96 62 pop push penup setpos 400 475 pendown cube 136 72 pop push penup setpos 285 342 pendown sphere 52 18 pop push penup setpos 575 342 pendown sphere 52 18 pop push tr 14 penup setpos 245 425 pendown cube 82 52 pop push tl 14 penup setpos 595 425 pendown cube 82 52 pop push penup setpos 330 515 pendown sphere 43 16 pop push penup setpos 495 515 pendown sphere 43 16 pop push tr 5 penup setpos 315 585 pendown cube 92 58 pop push tl 5 penup setpos 510 585 pendown cube 92 58 pop push penup setpos 300 688 pendown cube 112 62 pop push penup setpos 535 688 pendown cube 112 62 pop tr .65] setalpha .58 setglow 12 setgradient fef3c7 f59e0b 35 push penup setpos 400 350 pendown cube 180 110 pop push penup setpos 435 205 pendown cube 96 62 pop push penup setpos 400 475 pendown cube 136 72 pop setradial ffffff 22d3ee 42 push penup setpos 285 342 pendown sphere 45 12 pop push penup setpos 575 342 pendown sphere 45 12 pop setgradient fef3c7 f472b6 90 setsw 5 push penup setpos 405 210 pendown ellipse 26 12 pop setblend source-over setalpha 1 setglow 0]",
    image: "atlas-construction-mech.png",
    type: "performance",
    performanceFocus: "Articulated 3D model",
  }),
  example({
    name: "Aegis orbital lander",
    source:
      "repeat 1 [gradientbg 02030a 172554 45 hideturtle setseed 7314 setblend screen setalpha .3 setsw 1 setsc 64748b spray 390 720 setalpha .14 setglow 5 setgradient 22d3ee 818cf8 90 push penup setpos 345 405 pendown seth 90 grid3d 235 32 pop push penup setpos 455 405 pendown seth -90 grid3d 235 32 pop push penup setpos 400 238 pendown seth 180 grid3d 178 24 pop seth 0 setalpha .1 setgradient 22d3ee e879f9 35 repeat 12 [push penup setpos 400 348 pendown cube 112 78 pop push penup setpos 400 458 pendown cube 145 96 pop push penup setpos 400 555 pendown cube 92 68 pop push penup setpos 305 485 pendown cube 62 42 pop push penup setpos 515 485 pendown cube 62 42 pop push penup setpos 330 625 pendown sphere 44 14 pop push penup setpos 490 625 pendown sphere 44 14 pop tr .55] setalpha .62 setglow 14 setradial ffffff 38bdf8 52 push penup setpos 410 255 pendown sphere 44 16 pop setalpha .42 setgradient fef3c7 f472b6 45 push penup setpos 400 350 pendown cube 112 78 pop setradial ffffff f97316 38 push penup setpos 330 625 pendown sphere 36 12 pop push penup setpos 490 625 pendown sphere 36 12 pop setblend source-over setalpha 1 setglow 0]",
    image: "aegis-orbital-lander.png",
    type: "performance",
    performanceFocus: "Layered spacecraft mesh",
  }),
  example({
    name: "Lunar habitat complex",
    source:
      "repeat 1 [gradientbg 030712 172554 90 hideturtle setseed 2049 setblend screen setalpha .28 setsw 1 setsc 94a3b8 spray 390 650 setalpha .16 setglow 4 setgradient 64748b 38bdf8 90 push penup setpos 400 292 pendown seth 0 grid3d 365 48 pop setalpha .05 setgradient 22d3ee a78bfa 35 push penup setpos 245 440 pendown repeat 18 [sphere 112 28 tr 1.2] pop push penup setpos 565 405 pendown repeat 16 [sphere 86 24 tr 1.5] pop push penup setpos 475 600 pendown repeat 14 [sphere 68 20 tr 1.8] pop setalpha .48 setglow 8 setgradient fef3c7 38bdf8 45 push penup setpos 350 440 pendown seth -6 repeat 5 [cube 50 32 penup fd 47 pendown] pop push penup setpos 338 515 pendown seth 36 repeat 3 [cube 46 30 penup fd 52 pendown] pop push penup setpos 535 485 pendown seth 108 repeat 3 [cube 44 28 penup fd 50 pendown] pop setalpha .24 setgradient fef08a f59e0b 90 push penup setpos 95 555 pendown seth 88 grid3d 145 20 pop push penup setpos 665 520 pendown seth -88 grid3d 145 20 pop setalpha .65 setglow 13 setradial ffffff 22d3ee 42 push penup setpos 655 250 pendown sphere 38 14 pop setgradient ffffff 38bdf8 90 setsw 4 push penup setpos 655 288 pendown seth 90 fd 118 pop setblend source-over setalpha 1 setglow 0]",
    image: "lunar-habitat-complex.png",
    type: "performance",
    performanceFocus: "Architectural 3D model",
  }),
  example({
    name: "Obsidian voxel arcology",
    source:
      "repeat 1 [gradientbg 01030a 111827 90 hideturtle setblend screen setalpha .18 setglow 5 setsw 1 setgradient 22d3ee 818cf8 90 push penup setpos 400 220 pendown seth 0 grid3d 380 64 pop seth 0 setalpha .008 setglow 11 setgradient 22d3ee e879f9 45 repeat 320 [push penup setpos 270 275 pendown repeat 6 [cube 34 23 penup fd 52 pendown] pop push penup setpos 205 340 pendown repeat 8 [cube 46 31 penup fd 58 pendown] pop push penup setpos 125 420 pendown repeat 10 [cube 62 42 penup fd 65 pendown] pop push penup setpos 42 525 pendown repeat 12 [cube 86 58 penup fd 72 pendown] pop tr .08] setalpha .62 setglow 15 setgradient fef3c7 f59e0b 35 push penup setpos 400 315 pendown cube 172 116 pop push penup setpos 205 455 pendown cube 128 86 pop push penup setpos 595 455 pendown cube 128 86 pop setalpha .75 setradial ffffff 38bdf8 44 push penup setpos 430 185 pendown sphere 40 14 pop setblend source-over setalpha 1 setglow 0]",
    image: "obsidian-voxel-arcology.png",
    type: "performance",
    performanceFocus: "High-load voxel scene",
  }),
  example({
    name: "Leviathan fusion reactor",
    source:
      "repeat 1 [gradientbg 02030a 172554 45 hideturtle setblend screen setalpha .16 setglow 5 setsw 1 setgradient 64748b 38bdf8 90 push penup setpos 400 535 pendown seth 0 grid3d 350 48 pop penup setpos 400 370 pendown seth 0 setalpha .009 setglow 9 setgradient 22d3ee a78bfa 35 repeat 1920 [tr .1875 push penup fd 248 pendown tr 45 cube 54 36 sphere 24 18 pop] setalpha .013 setgradient fbbf24 f472b6 120 repeat 1440 [tr .25 push penup fd 168 pendown tr 30 cube 42 28 sphere 19 14 pop] setalpha .02 setgradient 38bdf8 e879f9 45 repeat 192 [sphere 138 32 tr .85] setalpha .54 setglow 14 setgradient fef3c7 f97316 12 sphere 126 32 setalpha .68 setradial ffffff f59e0b 82 fillpoly 32 76 setblend source-over setalpha 1 setglow 0]",
    image: "leviathan-fusion-reactor.png",
    type: "performance",
    performanceFocus: "High-load turbine model",
  }),
  example({
    name: "Radiation warning",
    source:
      "repeat 1 [setbc ffd43b hideturtle setsc 111827 setsw 1 fillpoly 72 230 setsc ffd43b seth -30 repeat 3 [push penup fd 150 pendown tr 180 fillpoly 3 170 pop tr 120] fillpoly 48 78 setsc 111827 fillpoly 48 43]",
    image: "radiation-warning.png",
    type: "symbols",
  }),
  example({
    name: "Biohazard warning",
    source: `repeat 1 [setbc f8fafc hideturtle penup setpos 400 420 pendown seth -90 setsc ffe119 setsw 1 fillpoly 3 340 setsc 111827 setsw 24 polygon 3 340 setsw 3 seth 0 ${scanlineCommands}]`,
    image: "biohazard.png",
    type: "symbols",
  }),
  example({
    name: "Yin yang",
    source:
      "repeat 1 [setbc 94a3b8 hideturtle setsc 111827 fillpoly 72 232 setsc f8fafc setsw 230 seth -90 arc 180 115 setsw 1 penup setpos 400 285 pendown fillpoly 48 115 setsc 111827 penup setpos 400 515 pendown fillpoly 48 115 penup setpos 400 285 pendown dot 34 setsc f8fafc penup setpos 400 515 pendown dot 34 setsc 111827 setsw 10 penup home pendown circle 232]",
    image: "yin-yang.png",
    type: "symbols",
  }),
  example({
    name: "Atomic orbit",
    source:
      "repeat 1 [gradientbg 020617 172554 45 hideturtle setblend screen setgradient 22d3ee a78bfa 45 setglow 18 setsw 7 repeat 3 [ellipse 260 95 tr 60] setradial ffffff 3a86ff 58 fillpoly 32 54 setsc fef08a setglow 22 penup setpos 660 400 pendown dot 24 penup setpos 270 318 pendown dot 24 penup setpos 270 482 pendown dot 24 setblend source-over setglow 0]",
    image: "atomic-orbit.png",
    type: "symbols",
  }),
  example({
    name: "Peace sign",
    source:
      "repeat 1 [gradientbg f8fafc dbeafe 90 hideturtle setgradient 1e3a8a 7c3aed 90 setsw 18 circle 235 push seth -90 fd 235 pop push seth 45 fd 235 pop push seth 135 fd 235 pop]",
    image: "peace-sign.png",
    type: "symbols",
  }),
  example({
    name: "Warning sign",
    source:
      "repeat 1 [gradientbg fef08a f59e0b 90 hideturtle setsc 111827 setsw 20 seth -90 polygon 3 270 penup setpos 400 285 pendown seth 90 setsw 30 fd 150 penup setpos 400 505 pendown dot 34]",
    image: "warning-sign.png",
    type: "symbols",
  }),
  example({
    name: "Power button",
    source:
      "repeat 1 [gradientbg 020617 0f172a 90 hideturtle setblend screen setgradient 22d3ee 3a86ff 90 setglow 24 setsw 28 seth -60 arc 300 220 penup setpos 400 155 pendown seth 90 fd 245 setblend source-over setglow 0]",
    image: "power-button.png",
    type: "symbols",
  }),
  example({
    name: "Wi-Fi signal",
    source:
      "repeat 1 [gradientbg 020617 1e1b4b 45 hideturtle setblend screen setgradient 38bdf8 a78bfa 0 setglow 22 setsw 28 penup setpos 400 575 pendown seth 180 arc 180 95 seth 180 arc 180 175 seth 180 arc 180 255 setradial ffffff 38bdf8 36 fillpoly 32 34 setblend source-over setglow 0]",
    image: "wifi-signal.png",
    type: "symbols",
  }),
  example({
    name: "Compass rose",
    source:
      "repeat 1 [gradientbg 082f49 0f172a 45 hideturtle setblend screen setgradient fef3c7 38bdf8 90 setglow 12 setsw 5 star 16 258 seth 11.25 star 8 205 setdash 8 8 circle 285 setdash 0 0 setradial ffffff f59e0b 55 fillpoly 16 52 setblend source-over setglow 0]",
    image: "compass-rose.png",
    type: "symbols",
  }),
  example({
    name: "Flower of life",
    source:
      "repeat 1 [gradientbg 071013 172554 90 hideturtle setblend screen setgradient 22d3ee f0abfc 45 setglow 14 setsw 6 circle 105 repeat 6 [push fd 105 circle 105 pop tr 60] setalpha .75 circle 210 setdash 8 8 circle 275 setdash 0 0 setblend source-over setalpha 1 setglow 0]",
    image: "flower-of-life.png",
    type: "symbols",
  }),
  example({
    name: "Turtle compass",
    source:
      "repeat 1 [hideturtle penup setpos 220 400 pendown seth 0 setdash 10 10 fd 360 penup home pendown seth 90 circle 70 showturtle]",
    image: "turtle-compass.png",
    type: "first-steps",
  }),
  example({
    name: "Rotating square bloom",
    source: "repeat 12 [repeat 4 [fd 120 tr 90] tr 30]",
    image: "square-flower.png",
    type: "first-steps",
    scale: 1.9,
  }),
  example({
    name: "Orbital bloom",
    source: "repeat 100 [repeat 100 [tr 18 fd 45] tr 219]",
    image: "cnormal3.jpg",
    type: "first-steps",
  }),
  example({
    name: "Shape orbit",
    source:
      "repeat 1 [hideturtle setsw 4 setsc 2563eb circle 210 setsc 7c3aed ellipse 260 120 setsc ec4899 repeat 12 [tr 30 arc 120 160] setsc f59e0b dot 30]",
    image: "shape-orbit.png",
    type: "geometry",
  }),
  example({
    name: "Polygon atlas",
    source:
      "repeat 1 [hideturtle setsc 06b6d4 polygon 6 175 setsc a855f7 fillpoly 6 118 setsc f59e0b star 12 215]",
    image: "polygon-atlas.png",
    type: "geometry",
  }),
  example({
    name: "Twin spirals",
    source:
      "repeat 1 [hideturtle setsc 0ea5e9 setsw 4 spiral 8 24 setsc ec4899 seth 180 spiral -6 28]",
    image: "twin-spirals.png",
    type: "geometry",
  }),
  example({
    name: "Lacework sun",
    source:
      "repeat 79 [repeat 102 [tr 103 fd 243 tl 19] tr 239 fd 22 tr 9 bk 9]",
    image: "cnormal10.jpg",
    type: "geometry",
  }),
  example({
    name: "Wireframe observatory",
    source:
      "repeat 1 [gradientbg 071013 172554 90 hideturtle setgradient 22d3ee a78bfa 45 setsw 3 sphere 150 10 seth 20 cube 260 100]",
    image: "wireframe-observatory.png",
    type: "depth",
  }),
  example({
    name: "Vanishing grid",
    source:
      "repeat 1 [gradientbg 020617 1e293b 90 hideturtle penup setpos 400 245 pendown setgradient 38bdf8 8b5cf6 90 setglow 12 seth 0 grid3d 330 16]",
    image: "vanishing-grid.png",
    type: "depth",
  }),
  example({
    name: "Orbiting cubes",
    source:
      "repeat 12 [push tr 30 penup fd 210 pendown seth 45 cube 95 55 pop tr 30]",
    image: "orbiting-cubes.png",
    type: "depth",
  }),
  example({
    name: "Radial sunrise",
    source:
      "repeat 1 [gradientbg 0f172a 312e81 45 hideturtle setradial fef08a f97316 230 setsw 9 star 18 230 setradial ffffff ec4899 160 fillpoly 12 120]",
    image: "radial-sunrise.png",
    type: "color-light",
  }),
  example({
    name: "Palette wheel",
    source:
      "repeat 1 [hideturtle setpalette ff006e ffb703 3a86ff 06d6a0 repeat 36 [star 5 170 tr 10]]",
    image: "palette-wheel.png",
    type: "color-light",
  }),
  example({
    name: "Luminous ellipses",
    source:
      "repeat 1 [gradientbg 020617 111827 90 hideturtle setblend screen setalpha .65 setglow 28 setsw 7 setpalette ff006e 00f5d4 fee440 repeat 24 [ellipse 190 70 tr 15] setblend source-over setalpha 1 setglow 0]",
    image: "luminous-ellipses.png",
    type: "color-light",
  }),
  example({
    name: "Rainbow rosette",
    source:
      "repeat 12 [setsc ff4d6d repeat 3 [fd 120 tr 120] tr 10 setsc ffb703 repeat 4 [fd 90 tr 90] tr 10 setsc 00b4d8 repeat 5 [fd 75 tr 72] tr 10]",
    image: "rainbow-rosette.png",
    type: "color-light",
    scale: 2.4,
  }),
  example({
    name: "Mauve orbit bloom",
    source:
      "repeat 8 [tr 15 fd 1 setsc debad3 bk 15 tl 47 setsc daa9cc repeat 27 [fd 10 tr 10 bk 10 tl 42 repeat 84 [fd 57 setsc 4d3345 tr 31 bk 11 setsc 5f3f55 tl 21 bk 9 fd 13 setsc ba97af tl 39 bk 20]]]",
    image: "ccolor6.jpg",
    type: "color-light",
    scale: 1.75,
    start: [438, 487],
  }),
  example({
    name: "Soft aurora",
    source:
      "repeat 1 [gradientbg 020617 1e1b4b 90 hideturtle setsymmetry 12 setsc 67e8f9 setsw 52 setsoftness .9 setflow .22 repeat 24 [fd 180 bk 180 tr 15] setsoftness 0 setflow 1 setsymmetry 1]",
    image: "soft-aurora.png",
    type: "brushes-particles",
  }),
  example({
    name: "Seeded nebula",
    source:
      "repeat 1 [gradientbg 030712 312e81 45 hideturtle setseed 42 setblend screen setalpha .7 setpalette f472b6 60a5fa fef08a repeat 8 [spray 210 280 tr 45] setblend source-over setalpha 1]",
    image: "seeded-nebula.png",
    type: "brushes-particles",
  }),
  example({
    name: "Misty dot mandala",
    source:
      "repeat 1 [hideturtle setsymmetry 16 setpalette fb7185 fbbf24 34d399 60a5fa setsw 30 setsoftness .8 setflow .35 repeat 18 [fd 16 dot 34 tr 13]]",
    image: "misty-dot-mandala.png",
    type: "brushes-particles",
  }),
  example({
    name: "Stateful starburst",
    source:
      "repeat 12 [tr 30 push setsc ff006e setsw 12 fd 150 dot 18 pop setsw 2 fd 210 bk 210]",
    image: "stateful-starburst.png",
    type: "generative-systems",
  }),
  example({
    name: "Neon kaleidoscope",
    source:
      "repeat 1 [setbc 050816 hideturtle setblend lighter setsymmetry 12 setgradient 00f5d4 ff006e 45 setglow 18 setsw 4 repeat 30 [fd 8 tr 17 fd 70 bk 70 tl 9] setsymmetry 1 setblend source-over]",
    image: "neon-kaleidoscope.png",
    type: "generative-systems",
  }),
  example({
    name: "Fractal snowflake",
    source:
      "repeat 12 [fd 60 repeat 4 [fd 22 tr 45 fd 18 bk 18 tl 90 fd 18 bk 18 tr 45] bk 148 tr 30]",
    image: "fractal-lightning-crown.png",
    type: "generative-systems",
    scale: 1.9,
  }),
  example({
    name: "Spiral lattice",
    source:
      "repeat 61 [fd 97 repeat 23 [bk 1 setsw 1 fd 12 repeat 10 [tr 9 fd 1 setsw 1 tl 20 bk 7 tr 13]] tr 23 setsw 7 fd 14]",
    image: "ccrazy6.jpg",
    type: "generative-systems",
    scale: 1.3,
    start: [422, 504],
  }),
];
