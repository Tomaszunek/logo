import type {
  ICommandModel,
  IExampleCollection,
  IPathwayExample,
} from "../models";
import { Parser } from "../utils/parser";

interface ExampleSpec {
  name: string;
  source: string;
  image: string;
  type: IPathwayExample["type"];
  scale?: number;
  start?: readonly [x: number, y: number];
}

const round = (value: number): number => Math.round(value * 100) / 100;

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

const serializeCommand = (command: Readonly<ICommandModel>): string => {
  if (command.name === "repeat") {
    const nestedCommands = command.commands
      ?.map((nestedCommand) => serializeCommand(nestedCommand))
      .join(" ");
    return `repeat ${command.value ?? 0} [${nestedCommands ?? ""}]`;
  }

  if (twoNumberCommands.has(command.name)) {
    return `${command.name} ${command.value ?? 0} ${command.arg2 ?? 0}`;
  }

  if (colorCommands.has(command.name)) {
    return `${command.name} ${command.color?.replace("#", "") ?? "000000"}`;
  }

  if (gradientCommands.has(command.name)) {
    const color1 = command.color?.replace("#", "") ?? "000000";
    const color2 = command.color2?.replace("#", "") ?? "ffffff";
    return `${command.name} ${color1} ${color2} ${command.value ?? 0}`;
  }

  if (noArgumentCommands.has(command.name)) {
    return command.name;
  }

  return `${command.name} ${serializeDefaultArgument(command)}`;
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

  return {
    ...spec,
    command,
    path: serializeCommand(command),
  };
};

export const exampleCollections: readonly IExampleCollection[] = [
  {
    id: "showstoppers",
    label: "Showstoppers",
    description:
      "Dense, surprising compositions that reveal how far commands can go.",
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
