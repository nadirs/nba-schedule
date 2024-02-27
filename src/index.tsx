import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "./index.scss";

const appRoot = document.createElement("div");
appRoot.id = "app";
document.body.appendChild(appRoot);
createRoot(appRoot).render(<App />);
