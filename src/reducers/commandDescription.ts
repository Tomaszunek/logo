import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ICommandDescription } from '../models';

const initialState: RootState.CommandDescriptionState = {
  fd: {
    short: "fd",
    name: "forward",
    long: "Turtle will go forward.",
    description: "", 
    color: "#ff0000",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },  
  bk: {
    short: "bk",
    name: "backward",
    long: "Turtle go backward",
    description: "", 
    color: "#ff0000",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },
  tl: {
    short: "tl",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "", 
    color: "#0000ff",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },
  tr: {
    short: "tr",
    name: "rotate right",
    long: "Turtle turn to right",
    description: "", 
    color: "#0000ff",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },  
  hideturtle: {    
    short: "hideturtle",
    name: "Show turtle",
    long: "Turtle will hide",
    description: "", 
    color: "#16969b",
    argCount: 0,
    args: [           ] 
  },
  repeat: {
    short: "repeat",
    name: "repeat",
    long: "Turtle move repeatdly",
    description: "", 
    color: "#ff00d4",
    argCount: 2,
    args: [       {name: "count", type: "number"} , {name: "commands", type: "another commands"}    ] 
  },
  showturtle: {
    short: "showturtle",
    name: "Hide turtle",
    long: "Turtle will shown",
    description: "", 
    color: "#16969b",
    argCount: 0,
    args: [           ] 
  },
  penup: {
    short: "penup",
    name: "Turtle penup",
    long: "Tuttle will stop drawing",
    description: "", 
    color: "#",
    argCount: 0,
    args: [           ] 
  },
  pendown: {
    short: "pendown",
    name: "Turtle pendown",
    long: "Tuttle will start drawing",
    description: "", 
    color: "#d9ec28",
    argCount: 0,
    args: [           ] 
  },
  setsc: {
    short: "setsc",
    name: "Setting stroke color",
    long: "Setting stroke color",
    description: "", 
    color: "#d9ec28",
    argCount: 1,
    args: [       {name: "line color", type: "color"}    ]
  },
  setsw: {
    short: "setsw",
    name: "Setting stroke waight",
    long: "Setting stroke waight",
    description: "", 
    color: "#00ff00",
    argCount: 1,
    args: [       {name: "weight stroke", type: "color"}    ]
  },
  setbc: {
    short: "setbc",
    name: "Setting background",
    long: "Setting background color to canvas",
    description: "", 
    color: "#00ff00",
    argCount: 1,
    args: [       {name: "background color", type: "color"}     ] 
  },
  save: {
    short: "save",
    name: "Save file",
    long: "Save file from canvas",
    description: "", 
    color: "#d66b12",
    argCount: 1,
    args: [       {name: "file name", type: "string"}     ] 
  },
  to: {
    short: "to",
    name: "Function to",
    long: "Make function",
    description: "", 
    color: "#aabbcc",
    argCount: 3,
    args: [       {name: "function name", type: "string"}, {name: "function args", type: "array"} , {name: "function body", type: "any"}      ] 
  },
  load: {
    short: "load",
    name: "Load file",
    long: "Load file to canvas",
    description: "", 
    color: "#d66b12",
    argCount: 1,
    args: [       {name: "file name", type: "string"}     ] 
  },
  setpos: {
    short: "setpos",
    name: "Set position",
    long: "Turtle set postion to <x,y>",
    description: "", 
    color: "#6cbada",
    argCount: 2,
    args: [       {name: "position x", type: "number"}, {name: "position y", type: "number"}      ] 
  },
  home: {
    short: "home",
    name: "Go home",
    long: "Turtle go to home",
    description: "", 
    color: "#6cbada",
    argCount: 0,
    args: [           ] 
  },
  
};

export const commandDescriptionReducer = handleActions<RootState.CommandDescriptionState, ICommandDescription>(
  {    
  },
  initialState
);
