import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ITutorialPage } from '../models';

const initialState: RootState.TutorialPages = [
  {
    name: "a",
    image: "abc",
    title: "woda",
    content: "string"
  },
  {
    name: "a",
    image: "abc",
    title: "woda",
    content: "string"
  }     
];

export const tutorialPageReducer = handleActions<RootState.TutorialPages, ITutorialPage>(
  {    
  },
  initialState
);
