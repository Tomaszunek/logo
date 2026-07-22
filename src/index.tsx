import * as React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./router";
import { configureStore } from "./store";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const store = configureStore();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Failed to find #root element for React root.");
}
const root = createRoot(rootEl!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  </Provider>
);

registerServiceWorker();