import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from '../App';

export const Application = () => (
  <Switch>
    <Route exact path="/" component={App} />
  </Switch>
);