import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ICommandDescription } from '../models';

const initialState: RootState.CommandDescriptionState = {
  fd: {
    short: "fd",
    name: "forward",
    long: "Turtle will go forward.",
    description: "",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },  
  bk: {
    short: "bk",
    name: "backward",
    long: "Turtle go backward",
    description: "",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },
  tl: {
    short: "tl",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },
  tr: {
    short: "tr",
    name: "rotate right",
    long: "Turtle turn to right",
    description: "",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },
  repeat: {
    short: "repeat",
    name: "repeat",
    long: "Turtle move repeatdly",
    description: "",
    argCount: 2,
    args: [       {name: "count", type: "number"} , {name: "commands", type: "another commands"}    ] 
  },
  hideturtle: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 0,
    args: [       {name: "no arguments", type: "none"}     ] 
  },
  showturtle: {
    short: "fd",
    name: "forward",
    long: "Turtle go forward",
    description: "",
    argCount: 0,
    args: [       {name: "no arguments", type: "none"}     ] 
  },
  penup: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 0,
    args: [       {name: "no arguments", type: "none"}     ] 
  },
  pendown: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 0,
    args: [       {name: "no arguments", type: "none"}     ] 
  },
  setsc: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1,
    args: [       {name: "distance", type: "number"}     ] 
  },
  setsw: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1,
    args: [       {name: "distance", type: "number"}     ] 
  },
  setbc: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1,
    args: [       {name: "distance", type: "number"}     ] 
  },
  to: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 3,
    args: [       {name: "distance", type: "number"}     ] 
  },
  save: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1,
    args: [       {name: "distance", type: "number"}     ] 
  },
  load: {
    short: "tr",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",
    argCount: 1,
    args: [       {name: "distance", type: "number"}     ] 
  },
  home: {
    short: "home",
    name: "Go home",
    long: "Turtle go to home",
    description: "",
    argCount: 0,
    args: [       {name: "no arguments", type: "none"}     ] 
  },
  setpos: {
    short: "setpos",
    name: "Set position",
    long: "Turtle set postion to <x,y>",
    description: "",
    argCount: 2,
    args: [       {name: "position x", type: "number"}, {name: "position y", type: "number"}      ] 
  }
  
};

export const commandDescriptionReducer = handleActions<RootState.CommandDescriptionState, ICommandDescription>(
  {    
  },
  initialState
);
