import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";

const appRoot = document.createElement("div");
appRoot.id = "app";
document.body.appendChild(appRoot);

ReactDOM.render(<App />, appRoot);
