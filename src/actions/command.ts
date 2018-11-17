import { createAction } from 'redux-actions';
import { ICommandModel } from '../models';

export namespace CommandActions {
  export enum Type {
    ADD_COMMAND = 'ADD_COMMAND',
    EDIT_COMMAND = 'EDIT_COMMAND',
    DELETE_COMMAND = 'DELETE_COMMAND',
    COMPLETE_COMMAND = 'COMPLETE_COMMAND',
    COMPLETE_ALL = 'COMPLETE_ALL',
    CLEAR_COMPLETED = 'CLEAR_COMPLETED'
  }

  export const addCommand = createAction<PartialPick<ICommandModel, 'name'>>(Type.ADD_COMMAND);
  export const editCommand = createAction<PartialPick<ICommandModel, 'id'>>(Type.EDIT_COMMAND);
  export const deleteCommand = createAction<ICommandModel['id']>(Type.DELETE_COMMAND);
  export const completeCommand = createAction<ICommandModel['id']>(Type.COMPLETE_COMMAND);
  export const completeAll = createAction(Type.COMPLETE_ALL);
  export const clearCompleted = createAction(Type.CLEAR_COMPLETED);
}

export type CommandActions = Omit<typeof CommandActions, 'Type'>;