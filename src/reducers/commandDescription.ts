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
  bk: {
    short: "bk",
    name: "backward",
    long: "Turtle go backward",
    description: ""
  },
  tl: {
    short: "tl",
    name: "rotate left",
    long: "Turtle turn to left",
    description: ""
  },
  tr: {
    short: "tr",
    name: "rotate right",
    long: "Turtle turn to right",
    description: ""
  },
  repeat: {
    short: "repeat",
    name: "repeat",
    long: "Turtle move repeatdly",
    description: ""
  },
  hideTurtle: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: ""
  },
  showTurtle: {
    short: "fd",
    name: "forward",
    long: "Turtle go forward",
    description: ""
  },
  penup: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: ""
  },
  pendown: {
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