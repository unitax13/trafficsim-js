import { useState } from "react";
import MainCanvasElement from "./components/MainCanvasElement";
import "./index.css";
import { StyledEngineProvider } from "@mui/material";

function App() {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <MainCanvasElement />
      </StyledEngineProvider>
    </>
  );
}

export default App;
