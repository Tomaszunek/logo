import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./router";
import { configureStore } from "./store";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();