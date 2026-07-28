import type { ICommandModel } from "./Command";
import type { IProcedureDefinition } from "./Procedure";

export interface IPathwayExample {
  name: string;
  path: string;
  command: ICommandModel;
  procedures: readonly IProcedureDefinition[];
  image: string;
  type: ExampleCategory;
  animationFocus?: string;
  performanceFocus?: string;
}

export type ExampleCategory =
  | "showstoppers"
  | "motion"
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
