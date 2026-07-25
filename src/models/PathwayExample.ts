import type { ICommandModel } from "./Command";

export interface IPathwayExample {
  name: string;
  path: string;
  command: ICommandModel;
  image: string;
  type: ExampleCategory;
}

export type ExampleCategory =
  | "first-steps"
  | "geometry"
  | "depth"
  | "color-light"
  | "brushes-particles"
  | "generative-systems";

export interface IExampleCollection {
  id: ExampleCategory;
  label: string;
  description: string;
}
