import * as React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./router";
// import { configureStore } from "./store";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import "./index.css";


const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Failed to find #root element for React root.");
}
const root = createRoot(rootEl!);
root.render(
<BrowserRouter>
    <Application />
</BrowserRouter>
);

registerServiceWorker();