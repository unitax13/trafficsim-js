import ReactDOM from "react-dom/client";
import App from "./App";
import React from "react";
import "./index.css";

// //const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// //const ctx = canvas.getContext("2d");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
