import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './router';
import { configureStore } from './store';
import { createBrowserHistory } from 'history';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import './index.css';

const store = configureStore();
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Application />
    </Router>
  </Provider>,  
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
