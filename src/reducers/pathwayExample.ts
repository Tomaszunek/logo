import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { IPathwayExample } from '../models';

const initialState: RootState.PathwayExample = [
  {
      name: 'command1',
      path: "command1",
      command: [],
      image: "command1.jpg"
  }
];

export const pathwayExampleReducer = handleActions<RootState.PathwayExample, IPathwayExample>(
  {    
  },
  initialState
);
