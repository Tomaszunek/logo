import { ICommandModel } from '../models';

export interface IRootState {
  commands: RootState.CommandState;
  descriptions: RootState.CommandDescriptionState;
  router?: any;
}

export namespace RootState {
  export type CommandState = ICommandModel[];
  export type CommandDescriptionState = any;
}