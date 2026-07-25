import type { IPathwayExample } from "../models";
import { Parser } from "../utils/parser";

type ExampleSpec = Omit<IPathwayExample, "command">;

const example = (spec: ExampleSpec): IPathwayExample => {
  const commands = new Parser(spec.path).parse(() => {
    throw new Error(`Invalid bundled example: ${spec.type} / ${spec.name}`);
  });

  if (commands.length !== 1) {
    throw new Error(
      `Bundled example must contain one root command: ${spec.type} / ${spec.name}`,
    );
  }

  return { ...spec, command: commands[0] };
};

export const pathwayExamples: readonly IPathwayExample[] = [
  example({
    name: "command3",
    path: "repeat 100 [repeat 100 [tr 18 fd 45] tr 219]",
    image: "cnormal3.jpg",
    type: "simple",
  }),
  example({
    name: "command10",
    path: "repeat 79 [repeat 102 [tr 103 fd 243 tl 19] tr 239 fd 22 tr 9 bk 9]",
    image: "cnormal10.jpg",
    type: "simple",
  }),
  example({
    name: "command11",
    path: "repeat 100 [repeat 100 [tr 18 fd 38] tr 239]",
    image: "cnormal11.jpg",
    type: "simple",
  }),
  example({
    name: "Square flower",
    path: "repeat 12 [repeat 4 [fd 120 tr 90] tr 30]",
    image: "square-flower.png",
    type: "simple",
  }),
  example({
    name: "command4",
    path: "repeat 60 [fd 102 repeat 1 [bk 17 repeat 10 [tr 15 fd 1 tl 20 bk 18 tr 12]] tr 25 fd 22]",
    image: "ccrazy4.jpg",
    type: "crazy",
  }),
  example({
    name: "command5",
    path: "repeat 61 [fd 97 repeat 10 [bk 17 setsw 2 repeat 10 [tr 15 setsw 1 fd 1 tl 20 bk 18 tr 13]] tr 23 setsw 15 fd 17]",
    image: "ccrazy5.jpg",
    type: "crazy",
  }),
  example({
    name: "command6",
    path: "repeat 61 [fd 97 repeat 23 [bk 1 setsw 1 fd 12 repeat 10 [tr 9 fd 1 setsw 1 tl 20 bk 7 tr 13]] tr 23 setsw 7 fd 14]",
    image: "ccrazy6.jpg",
    type: "crazy",
  }),
  example({
    name: "command12",
    path: "repeat 40 [fd 330 tr 1 repeat 20 [bk 4 tl 7 fd 1 repeat 12 [repeat 14 [fd 5 tr 4 bk 3] fd 11 tr 7] bk 4 tl 2] fd 4 tr 12]",
    image: "ccrazy12.jpg",
    type: "crazy",
  }),
  example({
    name: "Hexagon mandala",
    path: "repeat 36 [repeat 6 [fd 110 tr 60] tr 10 fd 8]",
    image: "hexagon-mandala.png",
    type: "crazy",
  }),
  example({
    name: "Fractal lightning crown",
    path: "repeat 12 [fd 60 repeat 4 [fd 22 tr 45 fd 18 bk 18 tl 90 fd 18 bk 18 tr 45] bk 148 tr 30]",
    image: "fractal-lightning-crown.png",
    type: "crazy",
  }),
  example({
    name: "Impossible woven cube",
    path: "repeat 3 [repeat 4 [fd 120 tr 90] tr 120 repeat 4 [fd 85 tr 90] tr 120]",
    image: "impossible-woven-cube.png",
    type: "crazy",
  }),
  example({
    name: "command6",
    path: "repeat 8 [tr 15 fd 1 setsc debad3 bk 15 tl 47 setsc daa9cc repeat 27 [fd 10 tr 10 bk 10 tl 42 repeat 84 [fd 57 setsc 4d3345 tr 31 bk 11 setsc 5f3f55 tl 21 bk 9 fd 13 setsc ba97af tl 39 bk 20]]]",
    image: "ccolor6.jpg",
    type: "color",
  }),
  example({
    name: "command9",
    path: "repeat 8 [tr 15 fd 1 setsc debad3 bk 15 tl 47 setsc daa9cc repeat 27 [fd 10 tr 10 bk 10 tl 74 repeat 88 [fd 90 setsc 4d3345 tr 40 bk 11 setsc 5f3f55 tl 34 bk 9 fd 13 setsc ba97af tl 39 bk 20]]]",
    image: "ccolor9.jpg",
    type: "color",
  }),
  example({
    name: "Rainbow rosette",
    path: "repeat 12 [setsc ff4d6d repeat 3 [fd 120 tr 120] tr 10 setsc ffb703 repeat 4 [fd 90 tr 90] tr 10 setsc 00b4d8 repeat 5 [fd 75 tr 72] tr 10]",
    image: "rainbow-rosette.png",
    type: "color",
  }),
  example({
    name: "Color pinwheel",
    path: "repeat 8 [setsc e63946 fd 150 bk 150 tr 15 setsc ffb703 fd 130 bk 130 tr 15 setsc 2a9d8f fd 110 bk 110 tr 15]",
    image: "color-pinwheel.png",
    type: "color",
  }),
  example({
    name: "Electric dreamcatcher",
    path: "repeat 24 [setsc ff006e repeat 3 [fd 135 tr 120] tr 5 setsc 8338ec repeat 4 [fd 100 tr 90] tr 5 setsc 3a86ff repeat 6 [fd 75 tr 60] tr 5]",
    image: "electric-dreamcatcher.png",
    type: "color",
  }),
  example({
    name: "Cybernetic iris",
    path: "repeat 1 [setbc 071013 repeat 36 [setsc 00ff9f setsw 3 repeat 4 [fd 100 tr 90] tr 10 setsc 00b8ff setsw 1 fd 150 bk 150]]",
    image: "cybernetic-iris.png",
    type: "color",
  }),
];
