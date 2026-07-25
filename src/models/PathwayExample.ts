import type { ICommandModel } from "./Command";

export interface IPathwayExample {
  name: string;
  path: string;
  command: ICommandModel;
  image: string;
  type: ExampleCategory;
  performanceFocus?: string;
}

export type ExampleCategory =
  | "showstoppers"
  | "symbols"
  | "first-steps"
  | "geometry"
  | "depth"
  | "color-light"
  | "brushes-particles"
  | "generative-systems"
  | "performance";

export interface IExampleCollection {
  id: ExampleCategory;
  label: string;
  description: string;
}
