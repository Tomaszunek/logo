import { createAction } from 'redux-actions';
import { ICommandModel } from '../models';

export namespace CommandActions {
  export enum Type {
    ADD_TODO = 'ADD_TODO',
    EDIT_TODO = 'EDIT_TODO',
    DELETE_TODO = 'DELETE_TODO',
    COMPLETE_TODO = 'COMPLETE_TODO',
    COMPLETE_ALL = 'COMPLETE_ALL',
    CLEAR_COMPLETED = 'CLEAR_COMPLETED'
  }

  export const addTodo = createAction<PartialPick<ICommandModel, 'name'>>(Type.ADD_TODO);
  export const editTodo = createAction<PartialPick<ICommandModel, 'id'>>(Type.EDIT_TODO);
  export const deleteTodo = createAction<ICommandModel['id']>(Type.DELETE_TODO);
  export const completeTodo = createAction<ICommandModel['id']>(Type.COMPLETE_TODO);
  export const completeAll = createAction(Type.COMPLETE_ALL);
  export const clearCompleted = createAction(Type.CLEAR_COMPLETED);
}

export type CommandActions = Omit<typeof CommandActions, 'Type'>;