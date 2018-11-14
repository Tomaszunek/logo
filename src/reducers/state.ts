import { ITodoModel } from '../models';

export interface IRootState {
  todos: RootState.TodoState;
  router?: any;
}

export namespace RootState {
  export type TodoState = ITodoModel[];
}