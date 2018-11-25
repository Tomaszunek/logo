import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ICommandDescription } from '../models';

const initialState: RootState.CommandDescriptionState = {
  fd: {
    short: "fd",
    name: "forward",
    long: "Turtle will go forward.",
    description: "", 
    color: "",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },  
  bk: {
    short: "bk",
    name: "backward",
    long: "Turtle go backward",
    description: "", 
    color: "",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },
  tl: {
    short: "tl",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "", 
    color: "",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },
  tr: {
    short: "tr",
    name: "rotate right",
    long: "Turtle turn to right",
    description: "", 
    color: "",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },
  repeat: {
    short: "repeat",
    name: "repeat",
    long: "Turtle move repeatdly",
    description: "", 
    color: "",
    argCount: 2,
    args: [       {name: "count", type: "number"} , {name: "commands", type: "another commands"}    ] 
  },
  hideturtle: {
    short: "hideturtle",
    name: "Show turtle",
    long: "Turtle will hide",
    description: "", 
    color: "",
    argCount: 0,
    args: [           ] 
  },
  showturtle: {
    short: "showturtle",
    name: "Hide turtle",
    long: "Turtle will shown",
    description: "", 
    color: "",
    argCount: 0,
    args: [           ] 
  },
  penup: {
    short: "penup",
    name: "Turtle penup",
    long: "Tuttle will stop drawing",
    description: "", 
    color: "",
    argCount: 0,
    args: [           ] 
  },
  pendown: {
    short: "pendown",
    name: "Turtle pendown",
    long: "Tuttle will start drawing",
    description: "", 
    color: "",
    argCount: 0,
    args: [           ] 
  },
  setsc: {
    short: "setsc",
    name: "Setting stroke color",
    long: "Setting stroke color",
    description: "", 
    color: "",
    argCount: 1,
    args: [       {name: "line color", type: "color"}    ]
  },
  setsw: {
    short: "setsw",
    name: "Setting stroke waight",
    long: "Setting stroke waight",
    description: "", 
    color: "",
    argCount: 1,
    args: [       {name: "weight stroke", type: "color"}    ]
  },
  setbc: {
    short: "setbc",
    name: "Setting background",
    long: "Setting background color to canvas",
    description: "", 
    color: "",
    argCount: 1,
    args: [       {name: "background color", type: "color"}     ] 
  },
  to: {
    short: "to",
    name: "Function to",
    long: "Make function",
    description: "", 
    color: "",
    argCount: 3,
    args: [       {name: "function name", type: "string"}, {name: "function args", type: "array"} , {name: "function body", type: "any"}      ] 
  },
  save: {
    short: "save",
    name: "Save file",
    long: "Save file from canvas",
    description: "", 
    color: "",
    argCount: 1,
    args: [       {name: "file name", type: "string"}     ] 
  },
  load: {
    short: "load",
    name: "Load file",
    long: "Load file to canvas",
    description: "", 
    color: "",
    argCount: 1,
    args: [       {name: "file name", type: "string"}     ] 
  },
  home: {
    short: "home",
    name: "Go home",
    long: "Turtle go to home",
    description: "", 
    color: "",
    argCount: 0,
    args: [           ] 
  },
  setpos: {
    short: "setpos",
    name: "Set position",
    long: "Turtle set postion to <x,y>",
    description: "", 
    color: "",
    argCount: 2,
    args: [       {name: "position x", type: "number"}, {name: "position y", type: "number"}      ] 
  }
  
};

export const commandDescriptionReducer = handleActions<RootState.CommandDescriptionState, ICommandDescription>(
  {    
  },
  initialState
);
