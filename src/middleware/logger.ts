import { Middleware } from 'redux';

export const logger: Middleware = (store) => (next) => (action) => {
  if (import.meta.env.DEV) {
    console.log(action);
  }
  return next(action);
};