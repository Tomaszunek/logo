import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ICommandDescription } from '../models';

const initialState: RootState.CommandDescriptionState = {
  fd: {
    short: "fd",
    name: "forward",
    long: "Turtle go forward",
    description: "",
    argCount: 1
  },  
  bk: {
    short: "bk",
    name: "backward",
    long: "Turtle go backward",
    description: "",
    argCount: 1
  },
  tl: {
    short: "tl",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1
  },
  tr: {
    short: "tr",
    name: "rotate right",
    long: "Turtle turn to right",
    description: "",
    argCount: 1
  },
  repeat: {
    short: "repeat",
    name: "repeat",
    long: "Turtle move repeatdly",
    description: "",
    argCount: 2
  },
  hideturtle: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 0
  },
  showturtle: {
    short: "fd",
    name: "forward",
    long: "Turtle go forward",
    description: "",
    argCount: 0
  },
  penup: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 0
  },
  pendown: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 0
  },
  setsc: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1
  },
  setsw: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1
  },
  setbc: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1
  },
  to: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 3
  },
  save: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1
  },
  load: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1
  },
  home: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 0
  },
  setpos: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 2
  }
  
};

export const commandDescriptionReducer = handleActions<RootState.CommandDescriptionState, ICommandDescription>(
  {    
  },
  initialState
);
