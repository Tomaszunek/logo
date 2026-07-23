import {
  ICommandModel,
  IPathwayExample,
  ITutorialPage,
  ICommandDescription,
} from "../models";

export interface IRootState {
  commands: ICommandModel[];
}

// Alias types for reducer state shapes
export type CommandState = ICommandModel[];
export type CommandDescriptionState = Record<string, ICommandDescription>;
export type PathwayExample = IPathwayExample[];
export type TutorialPages = ITutorialPage[];

// Export the same shape for compatibility
export type RootState = IRootState;
