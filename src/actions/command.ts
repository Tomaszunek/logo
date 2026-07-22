import { createAction } from 'redux-actions';
import { ICommandModel } from '../models';

export namespace CommandActions {
  export enum Type {
    ADD_COMMAND = 'ADD_COMMAND',
    EDIT_COMMAND = 'EDIT_COMMAND',
    SET_COMMAND = 'SET_COMMAND',
    DELETE_COMMAND = 'DELETE_COMMAND'    
  }

  // Payload includes full command model for add/edit/set
  export const addCommand = createAction<ICommandModel>(Type.ADD_COMMAND);
  export const editCommand = createAction<ICommandModel>(Type.EDIT_COMMAND);
  export const setCommand = createAction<ICommandModel>(Type.SET_COMMAND);
  export const deleteCommand = createAction<number>(Type.DELETE_COMMAND);
}

export type CommandActions = Omit<typeof CommandActions, 'Type'>;