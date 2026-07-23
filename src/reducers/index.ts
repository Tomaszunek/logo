import { combineReducers } from 'redux';
import type { IRootState, RootState } from './state';
import { commandReducer } from './command';

// Re‑export the state types for consumers
export * from './state';

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<IRootState>({
  commands: commandReducer as any,

});