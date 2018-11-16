import { createAction } from 'redux-actions';
import { ITodoModel } from '../models';

export namespace TodoActions {
  export enum Type {
    ADD_TODO = 'ADD_TODO',
    EDIT_TODO = 'EDIT_TODO',
    DELETE_TODO = 'DELETE_TODO',
    COMPLETE_TODO = 'COMPLETE_TODO',
    COMPLETE_ALL = 'COMPLETE_ALL',
    CLEAR_COMPLETED = 'CLEAR_COMPLETED'
  }

  export const addTodo = createAction<PartialPick<ITodoModel, 'text'>>(Type.ADD_TODO);
  export const editTodo = createAction<PartialPick<ITodoModel, 'id'>>(Type.EDIT_TODO);
  export const deleteTodo = createAction<ITodoModel['id']>(Type.DELETE_TODO);
  export const completeTodo = createAction<ITodoModel['id']>(Type.COMPLETE_TODO);
  export const completeAll = createAction(Type.COMPLETE_ALL);
  export const clearCompleted = createAction(Type.CLEAR_COMPLETED);
}

export type TodoActions = Omit<typeof TodoActions, 'Type'>;