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
  performanceFocus?: string;
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
