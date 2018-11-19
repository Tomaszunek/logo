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
  },
  {
    id: 2,
    name: CommandTypes.tl,
    value: 8
  },
  {
    id: 3,
    name: CommandTypes.fd,
    value: 100
  },
  {
    id: 4,
    name: CommandTypes.hideturtle
  },  
  {
    id: 5,
    name: CommandTypes.repeat,
    value: 4,
    commands: [{
      id: 6,
      name: CommandTypes.fd,
      value: 100
    },
    {
      id: 7,
      name: CommandTypes.fd,
      value: 100
    },
    {
      id: 8,
      name: CommandTypes.fd,
      value: 100
    },
    ]
  },
  {
    id: 9,
    name: CommandTypes.repeat,
    value: 4,
    commands: [{
      id: 10,
      name: CommandTypes.fd,
      value: 100
    },
    {
      id: 11,
      name: CommandTypes.fd,
      value: 100
    },
    {
      id: 14,
      name: CommandTypes.repeat,
      value: 4,
      commands: [{
        id: 15,
        name: CommandTypes.fd,
        value: 100
      },
      {
        id: 16,
        name: CommandTypes.fd,
        value: 100
      },
      {
        id: 17,
        name: CommandTypes.fd,
        value: 100
      },
      ]
    },
    ]
  },
  {
    id: 13,
    name: CommandTypes.setpos,
    value: 10
  },
];

export const commandReducer = handleActions<RootState.CommandState, ICommandModel>(
  {
    [CommandActions.Type.ADD_COMMAND]: (state, action) => {      
      const id = ((state[state.length - 1]) ? (state[state.length - 1].id + 1) : 0);
      if (action.payload) {
        return [
          ...state,
          {...action.payload, id}                  
        ];
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