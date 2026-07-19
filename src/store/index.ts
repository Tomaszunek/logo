import { Store, createStore, applyMiddleware } from 'redux';
import { logger } from '../middleware/logger';   // your custom middleware
import { rootReducer } from '../reducers';
import type { IRootState } from '../reducers/state';

/**
 * Configure the Redux store.
 *
 * - In production we just apply the logger middleware.
 * - In development we optionally add Redux DevTools if it is installed.
 */
export function configureStore(initialState?: IRootState): Store<IRootState> {
  const middleware = [logger];
  let enhancer: any;

  if (process.env.NODE_ENV !== 'production') {
    try {
      // Dynamic import – Vite will ignore this in production builds
      const { composeWithDevTools } = require('redux-devtools-extension');
      enhancer = composeWithDevTools(applyMiddleware(...middleware));
    } catch (_) {
      enhancer = applyMiddleware(...middleware);
    }
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  return createStore(rootReducer as any, initialState as any, enhancer) as Store<IRootState>;
}
