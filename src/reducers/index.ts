import { combineReducers } from 'redux';
import type { IRootState, RootState } from './state';
import { commandReducer } from './command';
import { commandDescriptionReducer } from './commandDescription';
import { pathwayExampleReducer } from './pathwayExample';
import { tutorialPageReducer } from './tutorialPageReducer'

// Re‑export the state types for consumers
export * from './state';

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<IRootState>({
  commands: commandReducer as any,
  descriptions: commandDescriptionReducer as any,
  pathwayExample: pathwayExampleReducer as any,
  tutorialPages: tutorialPageReducer as any
});