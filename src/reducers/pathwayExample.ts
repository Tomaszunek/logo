import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { IPathwayExample } from '../models';

const initialState: RootState.PathwayExample = [
  {
    name: 'command1',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command2',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command3',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command4',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command5',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command6',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command7',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command8',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command9',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command10',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command11',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command12',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command13',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command14',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command15',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command16',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command17',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command18',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command19',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command20',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command21',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command22',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command23',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command24',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command25',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command27',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command28',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command29',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command30',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command31',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command32',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command33',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command34',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  },
  {
    name: 'command35',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command36',
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command37',    
    path: "command1",
    command: [],
    image: "command1.jpg",
    type: "color"
  }
];

export const pathwayExampleReducer = handleActions<RootState.PathwayExample, IPathwayExample>(
  {    
  },
  initialState
);
