import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { configureStore } from './store';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import './index.css';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,    
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
