import { ICommandModel, IPathwayExample, ITutorialPage } from '../models';

export interface IRootState {
  commands: RootState.CommandState;
  descriptions: RootState.CommandDescriptionState;
  pathwayexpample: RootState.PathwayExample;
  tutorialPages: RootState.TutorialPages;
  router?: any;
}

export namespace RootState {
  export type CommandState = Array<ICommandModel>;
  export type CommandDescriptionState = any;
  export type PathwayExample = Array<IPathwayExample>;
  export type TutorialPages = Array<ITutorialPage>;
}