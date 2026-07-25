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
}
