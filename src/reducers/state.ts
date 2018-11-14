import { ITodoModel, ICommandModel } from '../models';

export interface IRootState {
  todos: RootState.TodoState;
  commands: RootState.CommandState;
  router?: any;
}

export namespace RootState {
  export type TodoState = ITodoModel[];
  export type CommandState = ICommandModel[];
}