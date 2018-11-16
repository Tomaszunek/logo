import { ITodoModel, ICommandModel } from '../models';

export interface IRootState {
  todos: RootState.TodoState;
  commands: RootState.CommandState;
  descriptions: RootState.CommandDescriptionState;
  router?: any;
}

export namespace RootState {
  export type TodoState = ITodoModel[];
  export type CommandState = ICommandModel[];
  export type CommandDescriptionState = any;
}