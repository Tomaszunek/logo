import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ITutorialPage } from '../models';

const initialState: RootState.TutorialPages = [
  {
    name: "Command input",
    image: "tutorial1.gif",
    title: "Type command",
    content: "Type command in command input and press enter."
  },
  {
    name: "Canvas",
    image: "tutorial2.gif",
    title: "Display turtle",
    content: "Wait for display your tutrle canvas."
  },
  {
    name: "Side editor",
    image: "tutorial3.gif",
    title: "Edit params",
    content: "In side editor or in upper panel you can change numbers and deleting commands."
  },
  {
    name: "Left panel",
    image: "tutorial4.gif",
    title: "Check list command",
    content: "Clicking in left arrow check all commands in turtle system"
  },
  {
    name: "Right panel",
    image: "tutorial5.gif",
    title: "Check list of examples",
    content: "Clicking in right arrow check our examples in turtle system"
  }   
];

export const tutorialPageReducer = handleActions<RootState.TutorialPages, ITutorialPage>(
  {    
  },
  initialState
);
