import type { CommandTypes } from "./CommandTypes";

export const blendModes = [
  "source-over",
  "screen",
  "multiply",
  "lighter",
  "overlay",
  "soft-light",
  "difference",
] as const;

export type BlendMode = (typeof blendModes)[number];

export const animationEasings = [
  "linear",
  "ease-in",
  "ease-out",
  "ease-in-out",
] as const;

export type AnimationEasing = (typeof animationEasings)[number];
export const animationModes = ["once", "repeat", "pingpong"] as const;
export type AnimationMode = (typeof animationModes)[number];
export type AnimationCycles = number | "infinite";
export type AnimationProperty =
  | "arg2"
  | "depth"
  | "height"
  | "rotation"
  | "value"
  | "width";

export interface ICommandAnimation {
  cycles: AnimationCycles;
  durationMs: number;
  easing: AnimationEasing;
  finish: number;
  mode: AnimationMode;
  property: AnimationProperty;
  start: number;
}

export interface ICommandModel {
  id: number;
  name: CommandTypes;
  value?: number;
  arg2?: number;
  color?: string;
  color2?: string;
  blend?: BlendMode;
  palette?: string[];
  commands?: ICommandModel[];
  animation?: ICommandAnimation;
  animations?: ICommandAnimation[];
  depth?: number;
  height?: number;
  rotation?: number;
  width?: number;
}
