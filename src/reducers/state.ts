import { ICommandModel, IPathwayExample, ITutorialPage } from '../models';

export interface IRootState {
  commands: ICommandModel[];
  descriptions: any;
  pathwayexpample: IPathwayExample[];
  tutorialPages: ITutorialPage[];
  router?: any;
}

// Export the same shape for compatibility
export type RootState = IRootState;