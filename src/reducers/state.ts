import { ICommandModel, IPathwayExample } from '../models';

export interface IRootState {
  commands: RootState.CommandState;
  descriptions: RootState.CommandDescriptionState;
  pathwayexpample: RootState.PathwayExample;
  router?: any;
}

export namespace RootState {
  export type CommandState = Array<ICommandModel>;
  export type CommandDescriptionState = any;
  export type PathwayExample = Array<IPathwayExample>;
}