import { useEffect, useRef, useState } from "react";
import "../index.css";
import { Button } from "@mui/material";
import FieldType from "../enums/FieldType";

interface CanvasProps {
  numRows: number;
  numColumns: number;
  fieldArray: FieldType[][];
  setFieldValue: (x: number, y: number, value: FieldType) => void;
  placeRectangleBetween: (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    fieldType: FieldType
  ) => void;
}

function Canvas(props: CanvasProps) {
  let color = "black";
  const canvasWidth = 800;
  const canvasHeight = 700;

  enum FieldType {
    Empty,
    Road1,
    Urban,
    Industrial,
  }

  let isPressed = false;

  let previousMouseX: number | undefined;
  let previousMouseY: number | undefined;
  let x: number | undefined;
  let y: number | undefined;

  console.log("canvas loading");

  const previousFieldPressedX = useRef<number>(0);
  const previousFieldPressedY = useRef<number>(0);
  const fieldPressedX = useRef<number>(0);
  const fieldPressedY = useRef<number>(0);

  const fieldTypeChosen = useRef<FieldType>(FieldType.Urban);
  const fieldWidth = 6;
  const fieldHeight = 6;
  let cameraX = 0;
  let cameraY = 0;
  let cameraScale = 1;
  let gridOpacity = 10;

  const urbanIsOn = true;
  const industryIsOn = true;
  const roadsIsOn = true;
  const nodeNumbersAreOn = false;
  const pathIsOn = false;
  const roadHeatmapIsOn = false;

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    console.log("Reloading");
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    contextRef.current = ctx;

    drawMainGrid(ctx);
    // drawGridOverlay(ctx);
  }, []);

  useEffect(() => {
    console.log("reloaded from isDrawing");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawMainGrid(ctx);
    drawCursorSingleSelection(ctx);
  }, [isDrawing]);

  function drawMainGrid(ctx) {
    console.log("drawing");
    for (let x = 0; x < props.numRows; x++) {
      for (let y = 0; y < props.numColumns; y++) {
        let type = props.fieldArray[x][y];
        if (type == FieldType.Urban && urbanIsOn) {
          color = "green";
        } else if (type == FieldType.Industrial && industryIsOn) {
          color = "#666622";
        } else if (type == FieldType.Road1 && roadsIsOn) {
          color = "#111111";
        } else {
          // EMPTY
          color = "#ddeeee";
        }
        ctx!.fillStyle = color;

        ctx!.fillRect(
          fieldWidth * 1 * x - cameraX,
          fieldHeight * cameraScale * y - cameraY,
          fieldWidth * cameraScale,
          fieldHeight * cameraScale
        );
      }
    }
  }

  function drawCursorSingleSelection(ctx) {
    if (!isPressed) {
      let type = props.fieldArray[fieldPressedX.current][fieldPressedY.current];
      if (type == FieldType.Urban) {
        color = "green";
      } else if (type == FieldType.Industrial) {
        color = "#666622";
      } else {
        color = "#111111";
      }

      ctx!.fillStyle = color;
      // ctx!.globalCompositOperation = "source-over";
      ctx.globalAlpha = 0.5;
      console.log(
        "Drawing sursor of  type ",
        type,
        " on ",
        fieldPressedX,
        fieldPressedY
      );

      ctx!.fillRect(
        fieldWidth * 1 * fieldPressedX.current - cameraX,
        fieldHeight * cameraScale * fieldPressedY.current - cameraY,
        fieldWidth * cameraScale,
        fieldHeight * cameraScale
      );
      ctx.globalAlpha = 1;
      // ctx!.globalCompositOperation = "source-over";
    }
  }

  function drawGridOverlay(ctx) {
    console.log("drawing grid overlay");
    ctx!.strokeStyle = "#111111";
    for (let x1 = 0; x1 <= props.numRows; x1++) {
      ctx.lineWidth = (1 * gridOpacity) / 100;

      ctx.moveTo(x1 * fieldWidth * cameraScale - cameraX, -1 - cameraY);
      ctx.lineTo(
        x1 * fieldWidth * cameraScale - cameraX,
        canvasHeight * cameraScale - cameraY
      );

      ctx.moveTo(-1 - cameraX, x1 * fieldWidth * cameraScale - cameraY);
      ctx.lineTo(
        canvasWidth * cameraScale - cameraX,
        x1 * fieldWidth * cameraScale - cameraY
      );
      ctx.stroke();
    }
  }

  function updateCoordsOfFieldWithMouseOn(x: number, y: number) {
    fieldPressedX.current = Math.floor(x / fieldWidth);
    fieldPressedY.current = Math.floor(y / fieldHeight);
    console.log("Mouse over ", fieldPressedX, fieldPressedY);
  }

  function updateCoordsOfFieldWithMousePREVIOUSLYOn(
    previousX: number,
    previousY: number
  ) {
    previousFieldPressedX.current = Math.floor(previousX / fieldWidth);
    previousFieldPressedY.current = Math.floor(previousY / fieldHeight);
    console.log(
      "previousFieldPressed: ",
      previousFieldPressedX,
      previousFieldPressedY
    );
  }

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log(e.nativeEvent);
    isPressed = true;
    x = e.nativeEvent.offsetX;
    y = e.nativeEvent.offsetY;
    // console.log(x, y);
    updateCoordsOfFieldWithMousePREVIOUSLYOn(x, y);
    updateCoordsOfFieldWithMouseOn(x, y);
    props.setFieldValue(
      fieldPressedX.current,
      fieldPressedY.current,
      fieldTypeChosen.current
    );
    setIsDrawing(!isDrawing);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(!isDrawing);
    x = e.nativeEvent.offsetX;
    y = e.nativeEvent.offsetY;
    updateCoordsOfFieldWithMouseOn(x, y);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    updateCoordsOfFieldWithMouseOn(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    console.log(
      "fieldPressed: ",
      previousFieldPressedX,
      previousFieldPressedY,
      "fieldReleased: ",
      fieldPressedX,
      fieldPressedY
    );
    if (e.nativeEvent.button === 0) {
      props.placeRectangleBetween(
        previousFieldPressedX.current,
        previousFieldPressedY.current,
        fieldPressedX.current,
        fieldPressedY.current,
        fieldTypeChosen.current
      );
    } else if (e.nativeEvent.button === 2) {
      props.placeRectangleBetween(
        previousFieldPressedX.current,
        previousFieldPressedY.current,
        fieldPressedX.current,
        fieldPressedY.current,
        FieldType.Empty
      );
      setIsDrawing(!isDrawing);
      isPressed = false;
    }
    setIsDrawing(!isDrawing);
    isPressed = false;
  };

  const onMouseLeave = (
    nativeEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {};

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const onKeyDown = (e) => {
    console.log(e.key);
  };

  return (
    <>
      <div className="border-black border-top  ">
        <canvas
          className="border-black border"
          id="canvas"
          width="800"
          height="700"
          ref={canvasRef}
          onMouseDown={(e) => onMouseDown(e)}
          onMouseMove={(e) => onMouseMove(e)}
          onMouseUp={(e) => onMouseUp(e)}
          onMouseLeave={(e) => onMouseLeave(e)}
          onKeyDown={(e) => onKeyDown(e)}
          onKeyDownCapture={(e) => onKeyDown(e)}
          onContextMenu={(e) => e.preventDefault()}
        ></canvas>
        <Button variant="contained" onClick={(e) => setIsDrawing(!isDrawing)}>
          Refresh
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            fieldTypeChosen.current = FieldType.Road1;
          }}
        >
          Road brush
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            fieldTypeChosen.current = FieldType.Urban;
          }}
        >
          Urban area brush
        </Button>
      </div>
    </>
  );
}

export default Canvas;
