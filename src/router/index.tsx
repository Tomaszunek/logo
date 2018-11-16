import * as React from 'react';
import { Route, Switch } from 'react-router';
import  App  from '../App';

export const Application = () => (
  <Switch>
    <Route path="/" component={App} />
  </Switch>
);