import { combineReducers } from 'redux';
import { IRootState, RootState } from './state';
import { commandReducer } from './command';
import { commandDescriptionReducer } from './commandDescription';

export { IRootState, RootState };

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<IRootState>({
  commands: commandReducer as any,
  descriptions: commandDescriptionReducer as any
});