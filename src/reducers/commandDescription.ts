import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ICommandDescription } from '../models';

const initialState: RootState.CommandDescriptionState = {
  setpos: {
    short: "setpos",
    name: "Set position",
    long: "Turtle set postion to <x,y>",
    description: "",  
		image: "setpos.gif",
    color: "#6cbada",
    argCount: 2,
    args: [       {name: "position x", type: "number"}, {name: "position y", type: "number"}      ] 
  },
  repeat: {
    short: "repeat",
    name: "repeat",
    long: "Turtle move repeatdly",
    description: "",  
		image: "repeat.gif",
    color: "#ff00d4",
    argCount: 2,
    args: [       {name: "count", type: "number"} , {name: "commands", type: "another commands"}    ] 
  },
  fd: {
    short: "fd",
    name: "forward",
    long: "Turtle will go forward.",
    description: "",  
		image: "fd.gif",
    color: "#ff0000",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },  
  bk: {
    short: "bk",
    name: "backward",
    long: "Turtle go backward",
    description: "",  
		image: "bk.gif",
    color: "#ff0000",
    argCount: 1,    
    args: [       {name: "distance", type: "number"}     ] 
  },
  tl: {
    short: "tl",
    name: "rotate left",
    long: "Turtle turn to left",
    description: "",  
		image: "tl.gif",
    color: "#0000ff",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },
  tr: {
    short: "tr",
    name: "rotate right",
    long: "Turtle turn to right",
    description: "",  
		image: "tr.gif",
    color: "#0000ff",
    argCount: 1,
    args: [       {name: "angle", type: "number:degree"}     ] 
  },  
  hideturtle: {    
    short: "hideturtle",
    name: "Show turtle",
    long: "Turtle will hide",
    description: "",  
		image: "hidet.gif",
    color: "#16969b",
    argCount: 0,
    args: [           ] 
  },
  showturtle: {
    short: "showturtle",
    name: "Hide turtle",
    long: "Turtle will shown",
    description: "",  
		image: "showt.gif",
    color: "#16969b",
    argCount: 0,
    args: [           ] 
  },
  penup: {
    short: "penup",
    name: "Turtle penup",
    long: "Tuttle will stop drawing",
    description: "",  
		image: "penup.gif",
    color: "#d9ec28",
    argCount: 0,
    args: [           ] 
  },
  pendown: {
    short: "pendown",
    name: "Turtle pendown",
    long: "Tuttle will start drawing",
    description: "",  
		image: "pendown.gif",
    color: "#d9ec28",
    argCount: 0,
    args: [           ] 
  },
  setsc: {
    short: "setsc",
    name: "Setting stroke color",
    long: "Setting stroke color",
    description: "",  
		image: "setsc.gif",
    color: "#00ff00",
    argCount: 1,
    args: [       {name: "line color", type: "color"}    ]
  },
  setsw: {
    short: "setsw",
    name: "Setting stroke waight",
    long: "Setting stroke waight",
    description: "",  
		image: "setsw.gif",
    color: "#00ff00",
    argCount: 1,
    args: [       {name: "weight stroke", type: "color"}    ]
  },
  setbc: {
    short: "setbc",
    name: "Setting background",
    long: "Setting background color to canvas",
    description: "",  
		image: "setbc.gif",
    color: "#00ff00",
    argCount: 1,
    args: [       {name: "background color", type: "color"}     ] 
  },
  save: {
    short: "save",
    name: "Save file",
    long: "Save file from canvas",
    description: "",  
		image: "save.jpg",
    color: "#d66b12",
    argCount: 1,
    args: [       {name: "file name", type: "string"}     ] 
  },
  load: {
    short: "load",
    name: "Load file",
    long: "Load file to canvas",
    description: "",  
		image: "load.jpg",
    color: "#d66b12",
    argCount: 1,
    args: [       {name: "file name", type: "string"}     ] 
  },
  home: {
    short: "home",
    name: "Go home",
    long: "Turtle go to home",
    description: "",  
		image: "home.gif",
    color: "#6cbada",
    argCount: 0,
    args: [           ] 
  },
  // to: {
  //   short: "to",
  //   name: "Function to",
  //   long: "Make function",
  //   description: "",  
	//   image: "command1.gif",
  //   color: "#aabbcc",
  //   argCount: 3,
  //   args: [       {name: "function name", type: "string"}, {name: "function args", type: "array"} , {name: "function body", type: "any"}      ] 
  // },
  
};

export const commandDescriptionReducer = handleActions<RootState.CommandDescriptionState, ICommandDescription>(
  {    
  },
  initialState
);
