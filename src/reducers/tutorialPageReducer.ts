import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ITutorialPage } from '../models';

const initialState: RootState.TutorialPages = [
    
];

export const tutorialPageReducer = handleActions<RootState.CommandDescriptionState, ITutorialPage>(
  {    
  },
  initialState
);
