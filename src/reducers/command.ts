import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { CommandActions } from '../actions'
import { ICommandModel } from '../models';
import { CommandTypes } from 'src/models/CommandTypes';

const initialState: RootState.CommandState = [
  {
    id: 1,
    name: CommandTypes.fd,
    value: 100
  }
];

export const commandReducer = handleActions<RootState.CommandState, ICommandModel>(
  {
    [CommandActions.Type.ADD_COMMAND]: (state, action) => {      
      let id = 0;
      if(state[state.length]) {
        id = 0;
      } else {
        const lastCommand = state[state.length - 1];
        if(lastCommand.commands) {
          id = findMostInsideRepeat(lastCommand.commands)
          
        } else {
          id = state[state.length - 1].id + 1;
        }
      }
      if(action.payload) {
        if(action.payload.commands) {
          action.payload.id = id;
          action.payload.commands = indexsizeRepeat(action.payload.commands, ++id);
          return [
            ...state,
            {...action.payload}                  
          ];
        } else {
          return [
            ...state,
            {...action.payload, id}                  
          ];
        }
      }
      return state;
    },
    [CommandActions.Type.DELETE_COMMAND]: (state, action) => {
      return state.filter((todo) => todo.id !== (action.payload as any));
    },
    [CommandActions.Type.EDIT_COMMAND]: (state, action) => {
      return state.map((todo) => {
        if (!todo || !action || !action.payload) {
          return todo;
        }
        return (todo.id || 0) === action.payload.id ? { ...todo, text: action.payload.name } : todo;
      });
    },
    [CommandActions.Type.COMPLETE_COMMAND]: (state, action) => {
      return state.map((todo) =>
        todo.id === (action.payload as any) ? { ...todo, completed: !todo.value } : todo
      );
    },
    [CommandActions.Type.COMPLETE_ALL]: (state, action) => {
      return state.map((todo) => ({ ...todo, completed: true }));
    },
    [CommandActions.Type.CLEAR_COMPLETED]: (state, action) => {
      return state.filter((todo) => !!todo.value === false);
    }
  },
  initialState
);

function findMostInsideRepeat(commands: Array<ICommandModel>) {
  let lastRepeatIndexCommand = 0;
  for(const command of commands) {
    lastRepeatIndexCommand = command.id;
    if(command.commands) {
      lastRepeatIndexCommand = findMostInsideRepeat(command.commands);
    }
  }
  lastRepeatIndexCommand = (lastRepeatIndexCommand ? lastRepeatIndexCommand : commands[commands.length -1].id)
  return lastRepeatIndexCommand++;
}

function indexsizeRepeat(commands: Array<ICommandModel> | undefined, lastIndex: number) {
  let index = lastIndex;
  if(commands) {
    for(const command of commands) {
      command.id = index;
      if(command.commands) {
        command.commands = indexsizeRepeat(command.commands, ++index);
      }
      index++;
    }
  } 
  return commands;
}