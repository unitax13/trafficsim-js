import { useEffect, useRef, useState } from "react";
import "../index.css";
import { Button, FormControlLabel, FormGroup, Switch } from "@mui/material";
import FieldType from "../enums/FieldType";
import PaintBrush from "../icons/PaintBrush";
import GraphNode from "../classes/GraphNode";
import GraphIcon from "../icons/GraphIcon";
import ColoredMuiSwitch from "./ColoredMuiSwitch";
import "../colors";
import colors from "../colors";
import {
  drawGridOverlay,
  drawMainGrid,
  drawNodeNumbers,
} from "../logic/drawingFunctions";

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
  generateGraph: () => GraphNode[] | undefined;
}

function Canvas(props: CanvasProps) {
  const graphNodesRef = useRef<GraphNode[] | null | undefined>(null);
  let color = "black";
  const canvasWidth = 800;
  const canvasHeight = 700;

  enum FieldType {
    Empty,
    Road1,
    Urban,
    Industrial,
  }

  const leftIsPressed = useRef<boolean>(false);
  const middleIsPressed = useRef<boolean>(false);
  const rightIsPressed = useRef<boolean>(false);
  //const isPressed = useRef<boolean>(false);

  function isPressed() {
    return leftIsPressed || middleIsPressed || rightIsPressed;
  }

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

  const [urbanIsOn, setUrbanIsOn] = useState<boolean>(true);
  const [industryIsOn, setIndustryIsOn] = useState<boolean>(true);
  const [roadsIsOn, setRoadsIsOn] = useState<boolean>(true);
  const [nodeNumbersAreOn, setNodeNumbersAreOn] = useState<boolean>(false);
  const [gridIsOn, setGridIsOn] = useState<boolean>(true);
  const pathIsOn = false;
  const roadHeatmapIsOn = false;

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    console.log("Reloading");
    const canvas = canvasRef.current;

    const ctx = canvas!.getContext("2d");
    contextRef.current = ctx;

    drawMainGrid(
      ctx,
      props.numRows,
      props.numColumns,
      props.fieldArray,
      urbanIsOn,
      industryIsOn,
      roadsIsOn,
      fieldWidth,
      fieldHeight,
      cameraScale,
      cameraX,
      cameraY
    );
    // drawGridOverlay(ctx);
  }, []);

  useEffect(() => {
    console.log("reloaded from isDrawing");
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext("2d");

    drawMainGrid(
      ctx,
      props.numRows,
      props.numColumns,
      props.fieldArray,
      urbanIsOn,
      industryIsOn,
      roadsIsOn,
      fieldWidth,
      fieldHeight,
      cameraScale,
      cameraX,
      cameraY
    );
    drawCursorSingleSelection(ctx);
    if (leftIsPressed.current || rightIsPressed.current) {
      drawRectangularSelection(
        ctx,
        previousFieldPressedX.current,
        previousFieldPressedY.current,
        fieldPressedX.current,
        fieldPressedY.current
      );
    }
    nodeNumbersAreOn
      ? drawNodeNumbers(ctx, graphNodesRef, fieldWidth, cameraScale)
      : null;
    gridIsOn
      ? drawGridOverlay(
          ctx,
          props.numRows,
          props.numColumns,
          fieldWidth,
          fieldHeight,
          cameraScale,
          cameraX,
          cameraY,
          canvasWidth,
          canvasHeight
        )
      : null;
  }, [isDrawing]);

  function redraw() {
    setIsDrawing(!isDrawing);
  }

  function drawCursorSingleSelection(ctx: CanvasRenderingContext2D) {
    if (!leftIsPressed.current) {
      if (
        fieldPressedX.current >= 0 &&
        fieldPressedY.current >= 0 &&
        fieldPressedX.current < props.numColumns &&
        props.numRows < props.numRows
      ) {
        let type =
          props.fieldArray[fieldPressedX.current][fieldPressedY.current];
        if (type == FieldType.Urban) {
          color = colors.urban;
        } else if (type == FieldType.Industrial) {
          color = colors.industry;
        } else {
          color = colors.roads;
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
    ctx: CanvasRenderingContext2D,
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

    if (rightIsPressed.current) {
      color = "black";
    } else if (fieldTypeChosen.current == FieldType.Urban) {
      color = colors.urban;
    } else if (fieldTypeChosen.current == FieldType.Industrial) {
      color = colors.industry;
    } else if (fieldTypeChosen.current == FieldType.Road1) {
      color = colors.roads;
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
    switch (e.nativeEvent.button) {
      case 0:
        {
          leftIsPressed.current = true;
        }
        break;
      case 1:
        {
          middleIsPressed.current = true;
        }
        break;
      case 2: {
        rightIsPressed.current = true;
      }
    }

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
    redraw();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    redraw();
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
    if (leftIsPressed.current) {
      props.placeRectangleBetween(
        previousFieldPressedX.current,
        previousFieldPressedY.current,
        fieldPressedX.current,
        fieldPressedY.current,
        fieldTypeChosen.current
      );
    } else if (rightIsPressed.current) {
      props.placeRectangleBetween(
        previousFieldPressedX.current,
        previousFieldPressedY.current,
        fieldPressedX.current,
        fieldPressedY.current,
        FieldType.Empty
      );
    }
    redraw();
    //isPressed.current = false;

    switch (e.nativeEvent.button) {
      case 0:
        {
          leftIsPressed.current = false;
        }
        break;
      case 1:
        {
          middleIsPressed.current = false;
        }
        break;
      case 2: {
        rightIsPressed.current = false;
      }
    }
  };

  const onMouseLeave = (
    nativeEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    leftIsPressed.current = false;
    middleIsPressed.current = false;
    rightIsPressed.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    console.log(e.key);
  };

  function generateGraphButtonPressed() {
    graphNodesRef.current = props.generateGraph();
    if (graphNodesRef.current !== undefined) {
      console.log("not undefined ", graphNodesRef.current.length);
      graphNodesRef.current.forEach((node: GraphNode) => {
        console.log("hello");
        console.log(node.x, node.y);
        console.log(node.distances!.toString());
      });
    }
    redraw();
  }

  return (
    <>
      <div className="">
        <div className="flex gap-2 items-center">
          <div className="flex flex-col items-center w-44">
            <div>
              <Button
                fullWidth
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
                fullWidth
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
                fullWidth
                startIcon={<PaintBrush />}
                variant="contained"
                className="bg-yellow-600 hover:bg-yellow-700"
                onClick={(e) => {
                  fieldTypeChosen.current = FieldType.Industrial;
                }}
              >
                Industry area
              </Button>
            </div>
            <div className="mt-4 w-full flex flex-col items-center border-2 border-slate-200 border-solid">
              <FormGroup>
                <FormControlLabel
                  control={
                    <ColoredMuiSwitch
                      colorHex={colors.roads}
                      color="primary"
                      checked={roadsIsOn}
                      onChange={(e) => {
                        setRoadsIsOn(!roadsIsOn);
                        redraw();
                      }}
                    />
                  }
                  label="Roads"
                />
                <FormControlLabel
                  control={
                    <ColoredMuiSwitch
                      colorHex={colors.urban}
                      color="primary"
                      checked={urbanIsOn}
                      onChange={(e) => {
                        setUrbanIsOn(!urbanIsOn);
                        redraw();
                      }}
                    />
                  }
                  label="Urban"
                />
                <FormControlLabel
                  control={
                    <ColoredMuiSwitch
                      colorHex={colors.industry}
                      color="primary"
                      checked={industryIsOn}
                      onChange={(e) => {
                        setIndustryIsOn(!industryIsOn);
                        redraw();
                      }}
                    />
                  }
                  label="Industry"
                />
                <FormControlLabel
                  control={
                    <ColoredMuiSwitch
                      colorHex={colors.graphColor}
                      color="primary"
                      checked={nodeNumbersAreOn}
                      onChange={(e) => {
                        setNodeNumbersAreOn(!nodeNumbersAreOn);
                        redraw();
                      }}
                    />
                  }
                  label="Node numbers"
                />
                <FormControlLabel
                  control={
                    <ColoredMuiSwitch
                      colorHex="#111111"
                      color="primary"
                      checked={gridIsOn}
                      onChange={(e) => {
                        setGridIsOn(!gridIsOn);
                        redraw();
                      }}
                    />
                  }
                  label="Grid"
                />
              </FormGroup>
            </div>
          </div>
          <div className="border-slate-500 border border-solid">
            <canvas
              id="canvas"
              width="660"
              height="660"
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
        </div>
        {/* X,Y text */}
        <div className="flex">
          {leftIsPressed.current || rightIsPressed.current ? (
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

        <Button
          startIcon={<GraphIcon />}
          variant="contained"
          className="bg-slate-500 hover:bg-slate-600"
          onClick={(e) => {
            generateGraphButtonPressed();
          }}
        >
          Make a graph
        </Button>
      </div>
    </>
  );
}

export default Canvas;
