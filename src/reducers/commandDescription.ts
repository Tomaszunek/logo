import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ICommandDescription } from '../models';

const initialState: RootState.CommandDescriptionState = {
  fd: {
    short: "fd",
    name: "forward",
    long: "Turtle go forward",
    description: ""
  },
  tl: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: ""
  }
};

export const commandDescriptionReducer = handleActions<RootState.CommandDescriptionState, ICommandDescription>(
  {    
  },
  initialState
);