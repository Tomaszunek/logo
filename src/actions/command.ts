import { createAction } from 'redux-actions';
import { ICommandModel } from '../models';

export namespace CommandActions {
  export enum Type {
    ADD_COMMAND = 'ADD_COMMAND',
    EDIT_COMMAND = 'EDIT_COMMAND',
    SET_COMMAND = 'SET_COMMAND',
    DELETE_COMMAND = 'DELETE_COMMAND'    
  }

  export const addCommand = createAction<PartialPick<ICommandModel, 'name'>>(Type.ADD_COMMAND);
  export const editCommand = createAction<PartialPick<ICommandModel, 'id'>>(Type.EDIT_COMMAND);
  export const setCommand = createAction<PartialPick<ICommandModel, "id">>(Type.SET_COMMAND);
  export const deleteCommand = createAction<ICommandModel['id']>(Type.DELETE_COMMAND);  
}

export type CommandActions = Omit<typeof CommandActions, 'Type'>;