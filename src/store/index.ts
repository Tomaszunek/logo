import { Store, createStore, applyMiddleware, compose } from "redux";
import { logger } from "../middleware/logger";
import { rootReducer } from "../reducers";
import type { IRootState } from "../reducers/state";

type DevToolsWindow = typeof window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
};

export function configureStore(initialState?: IRootState): Store<IRootState> {
  const middleware = [logger];
  const composeEnhancers =
    (import.meta.env.DEV &&
      (window as DevToolsWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  return createStore(
    rootReducer as any,
    initialState as any,
    enhancer,
  ) as Store<IRootState>;
}
