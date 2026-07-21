import { ICommandModel, IPathwayExample, ITutorialPage, ICommandDescription } from '../models';

export interface IRootState {
  commands: ICommandModel[];
  descriptions: Record<string, ICommandDescription>;
  pathwayExample: IPathwayExample[];
  tutorialPages: ITutorialPage[];
  router?: any;
}

// Alias types for reducer state shapes
export type CommandState = ICommandModel[];
export type CommandDescriptionState = Record<string, ICommandDescription>;
export type PathwayExample = IPathwayExample[];
export type TutorialPages = ITutorialPage[];

// Namespace for nested types used in reducers
export namespace RootState {
  export type CommandState = ICommandModel[];
  export type CommandDescriptionState = Record<string, ICommandDescription>;
  export type PathwayExample = IPathwayExample[];
  export type TutorialPages = ITutorialPage[];
}

// Export the same shape for compatibility
export type RootState = IRootState;
