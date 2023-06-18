import { useEffect, useRef, useState } from "react";
import "../index.css";
import { Button } from "@mui/material";
import FieldType from "../enums/FieldType";
import PaintBrush from "../icons/PaintBrush";

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

  const isPressed = useRef<boolean>(false);

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
    if (isPressed.current) {
      drawRectangularSelection(
        ctx,
        previousFieldPressedX.current,
        previousFieldPressedY.current,
        fieldPressedX.current,
        fieldPressedY.current
      );
    }
  }, [isDrawing]);

  function drawMainGrid(ctx) {
    //console.log("drawing");
    for (let x = 0; x < props.numRows; x++) {
      for (let y = 0; y < props.numColumns; y++) {
        let type = props.fieldArray[x][y];
        if (type == FieldType.Urban && urbanIsOn) {
          color = "#65a30d";
        } else if (type == FieldType.Industrial && industryIsOn) {
          color = "#854d0e";
        } else if (type == FieldType.Road1 && roadsIsOn) {
          color = "#1e293b";
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
    if (!isPressed.current) {
      if (
        fieldPressedX.current >= 0 &&
        fieldPressedY.current >= 0 &&
        fieldPressedX.current < props.numColumns &&
        props.numRows < props.numRows
      ) {
        let type =
          props.fieldArray[fieldPressedX.current][fieldPressedY.current];
        if (type == FieldType.Urban) {
          color = "#65a30d";
        } else if (type == FieldType.Industrial) {
          color = "#854d0e";
        } else {
          color = "#1e293b";
        }

        ctx!.fillStyle = color;
        // ctx!.globalCompositOperation = "source-over";
        ctx.globalAlpha = 0.5;
        // console.log(
        //   "Drawing sursor of  type ",
        //   type,
        //   " on ",
        //   fieldPressedX,
        //   fieldPressedY
        // );

        ctx!.fillRect(
          fieldWidth * 1 * fieldPressedX.current - cameraX,
          fieldHeight * cameraScale * fieldPressedY.current - cameraY,
          fieldWidth * cameraScale,
          fieldHeight * cameraScale
        );
        ctx.globalAlpha = 1;
      }
    }
  }

  function drawRectangularSelection(
    ctx,
    ax: number,
    ay: number,
    bx: number,
    by: number
  ) {
    console.log("drawing rectangular selection");
    let deltaX = bx - ax;
    let deltaY = by - ay;
    let signumDeltaX = Math.sign(deltaX);
    let signumDeltaY = Math.sign(deltaY);

    if (fieldTypeChosen.current == FieldType.Urban) {
      color = "#65a30d";
    } else if (fieldTypeChosen.current == FieldType.Industrial) {
      color = "#854d0e";
    } else if (fieldTypeChosen.current == FieldType.Road1) {
      color = "#1e293b";
    } else {
      color = "black";
    }
    ctx!.fillStyle = color;
    ctx.globalAlpha = 0.5;
    //if (!mainWindow.middleIsDown) {
    if (
      deltaX == 0 ||
      deltaY == 0 ||
      fieldTypeChosen.current == FieldType.Road1
    ) {
      if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        if (deltaX >= 0) {
          ctx!.fillRect(
            fieldWidth * cameraScale * ax - cameraX,
            fieldHeight * cameraScale * ay - cameraY,
            fieldWidth * cameraScale * deltaX,
            fieldHeight * cameraScale
          );
        } else {
          ctx!.fillRect(
            fieldWidth * cameraScale * bx - cameraX,
            fieldHeight * cameraScale * ay - cameraY,
            -fieldWidth * cameraScale * deltaX,
            fieldHeight * cameraScale
          );
        }
      } else {
        if (deltaY >= 0) {
          ctx!.fillRect(
            fieldWidth * cameraScale * ax - cameraX,
            fieldHeight * cameraScale * ay - cameraY,
            fieldWidth * cameraScale,
            fieldHeight * cameraScale * deltaY
          );
        } else {
          ctx!.fillRect(
            fieldWidth * cameraScale * ax - cameraX,
            fieldHeight * cameraScale * by - cameraY,
            fieldWidth * cameraScale,
            -fieldHeight * cameraScale * deltaY
          );
        }
      }
    } else {
      if (signumDeltaX >= 0 && signumDeltaY >= 0) {
        //heading south-east
        ctx!.fillRect(
          fieldWidth * cameraScale * ax - cameraX,
          fieldHeight * cameraScale * ay - cameraY,
          fieldWidth * cameraScale * (deltaX + 1),
          fieldHeight * cameraScale * (deltaY + 1)
        );
      } else if (signumDeltaX >= 0 && signumDeltaY < 0) {
        //heading north-east
        ctx!.fillRect(
          fieldWidth * cameraScale * ax - cameraX,
          fieldHeight * cameraScale * by - cameraY,
          fieldWidth * cameraScale * (deltaX + 1),
          -fieldHeight * cameraScale * (deltaY - 1)
        );
      } else if (signumDeltaX < 0 && signumDeltaY < 0) {
        //heading north-west
        ctx!.fillRect(
          fieldWidth * cameraScale * bx - cameraX,
          fieldHeight * cameraScale * by - cameraY,
          -fieldWidth * cameraScale * (deltaX - 1),
          -fieldHeight * cameraScale * (deltaY - 1)
        );
      } else if (signumDeltaX < 0 && signumDeltaY >= 0) {
        //heading south-west
        ctx!.fillRect(
          fieldWidth * cameraScale * bx - cameraX,
          fieldHeight * cameraScale * ay - cameraY,
          -fieldWidth * cameraScale * (deltaX - 1),
          fieldHeight * cameraScale * (deltaY + 1)
        );
      }
    }
    //}

    ctx.globalAlpha = 1;
    //ctx!.setGlobalBlendMode(BlendMode.SRC_OVER);
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
    fieldPressedX.current =
      Math.floor(x / fieldWidth) >= props.numColumns
        ? props.numColumns
        : Math.floor(x / fieldWidth) < 0
        ? 0
        : Math.floor(x / fieldWidth);
    fieldPressedY.current =
      Math.floor(y / fieldHeight) >= props.numRows
        ? props.numRows
        : Math.floor(y / fieldHeight) < 0
        ? 0
        : Math.floor(y / fieldHeight);
    console.log("Mouse over ", fieldPressedX, fieldPressedY);
  }

  function updateCoordsOfFieldWithMousePREVIOUSLYOn(
    previousX: number,
    previousY: number
  ) {
    previousFieldPressedX.current =
      Math.floor(previousX / fieldWidth) >= props.numColumns
        ? props.numColumns
        : Math.floor(previousX / fieldWidth) < 0
        ? 0
        : Math.floor(previousX / fieldWidth);
    previousFieldPressedY.current =
      Math.floor(previousY / fieldHeight) >= props.numRows
        ? props.numRows
        : Math.floor(previousY / fieldHeight) < 0
        ? 0
        : Math.floor(previousY / fieldHeight);
    console.log(
      "previousFieldPressed: ",
      previousFieldPressedX,
      previousFieldPressedY
    );
  }

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log("IS DOWN, IS PRESSED SET TO TRUE");
    isPressed.current = true;
    x = e.nativeEvent.offsetX;
    y = e.nativeEvent.offsetY;
    // console.log(x, y);
    updateCoordsOfFieldWithMousePREVIOUSLYOn(x, y);
    updateCoordsOfFieldWithMouseOn(x, y);
    if (e.nativeEvent.button === 0) {
      props.setFieldValue(
        fieldPressedX.current,
        fieldPressedY.current,
        fieldTypeChosen.current
      );
    } else if (e.nativeEvent.button === 2) {
      props.setFieldValue(
        fieldPressedX.current,
        fieldPressedY.current,
        FieldType.Empty
      );
    }
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
    }
    setIsDrawing(!isDrawing);
    isPressed.current = false;
  };

  const onMouseLeave = (
    nativeEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    isPressed.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    console.log(e.key);
  };

  return (
    <>
      <div className="border-black border-top border">
        <div className="">
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
          />
        </div>
        <div className="flex">
          {isPressed.current ? (
            <h3 className="font-bold">
              [{previousFieldPressedX.current};{previousFieldPressedY.current}]
            </h3>
          ) : (
            ""
          )}

          <h3 className="font-bold">
            [{fieldPressedX.current};{fieldPressedY.current}]
          </h3>
        </div>
        <div className="flex items-center">
          {/* <Button variant="contained" onClick={(e) => setIsDrawing(!isDrawing)}>
            Refresh
          </Button> */}
          <Button
            startIcon={<PaintBrush />}
            className="bg-slate-800 hover:bg-slate-900"
            variant="contained"
            onClick={(e) => {
              fieldTypeChosen.current = FieldType.Road1;
            }}
          >
            Road
          </Button>
          <Button
            startIcon={<PaintBrush />}
            className="bg-lime-600 hover:bg-lime-700"
            variant="contained"
            onClick={(e) => {
              fieldTypeChosen.current = FieldType.Urban;
            }}
          >
            Urban area
          </Button>
          <Button
            startIcon={<PaintBrush />}
            variant="contained"
            className="bg-yellow-800 hover:bg-yellow-900"
            onClick={(e) => {
              fieldTypeChosen.current = FieldType.Industrial;
            }}
          >
            Industry area
          </Button>
        </div>
      </div>
    </>
  );
}

export default Canvas;
