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
  drawCursorSingleSelection,
  drawGridOverlay,
  drawMainGrid,
  drawNodeNumbers,
  drawRectangularSelection,
} from "../logic/drawingFunctions";
import ViewIcon from "../icons/ViewIcon";
import DijkstraIcon from "../icons/DijkstraIcon";

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

  enum viewModes {
    NORMAL,
    SHORTEST_PATHING,
    HEATMAP,
  }

  const viewMode = useRef<viewModes>(viewModes.NORMAL);

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
  const fieldSize = 6;
  let cameraX = 0;
  let cameraY = 0;
  let cameraScale = 1;

  const [urbanIsOn, setUrbanIsOn] = useState<boolean>(true);
  const [industryIsOn, setIndustryIsOn] = useState<boolean>(true);
  const [roadsIsOn, setRoadsIsOn] = useState<boolean>(true);
  const [nodeNumbersAreOn, setNodeNumbersAreOn] = useState<boolean>(true);
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
      fieldSize,
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
      fieldSize,
      cameraScale,
      cameraX,
      cameraY
    );
    drawCursorSingleSelection(
      ctx,
      leftIsPressed,
      fieldPressedX,
      fieldPressedY,
      props.numRows,
      props.numColumns,
      props.fieldArray,
      fieldSize,
      cameraX,
      cameraY,
      cameraScale
    );
    if (leftIsPressed.current || rightIsPressed.current) {
      drawRectangularSelection(
        ctx,
        previousFieldPressedX.current,
        previousFieldPressedY.current,
        fieldPressedX.current,
        fieldPressedY.current,
        fieldTypeChosen,
        rightIsPressed,
        fieldSize,
        cameraScale,
        cameraX,
        cameraY
      );
    }
    nodeNumbersAreOn
      ? drawNodeNumbers(ctx, graphNodesRef, fieldSize, cameraScale)
      : null;
    gridIsOn
      ? drawGridOverlay(
          ctx,
          props.numRows,
          fieldSize,
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

  function updateCoordsOfFieldWithMouseOn(x: number, y: number) {
    fieldPressedX.current =
      Math.floor(x / fieldSize) >= props.numColumns
        ? props.numColumns
        : Math.floor(x / fieldSize) < 0
        ? 0
        : Math.floor(x / fieldSize);
    fieldPressedY.current =
      Math.floor(y / fieldSize) >= props.numRows
        ? props.numRows
        : Math.floor(y / fieldSize) < 0
        ? 0
        : Math.floor(y / fieldSize);
    console.log("Mouse over ", fieldPressedX, fieldPressedY);
  }

  function updateCoordsOfFieldWithMousePREVIOUSLYOn(
    previousX: number,
    previousY: number
  ) {
    previousFieldPressedX.current =
      Math.floor(previousX / fieldSize) >= props.numColumns
        ? props.numColumns
        : Math.floor(previousX / fieldSize) < 0
        ? 0
        : Math.floor(previousX / fieldSize);
    previousFieldPressedY.current =
      Math.floor(previousY / fieldSize) >= props.numRows
        ? props.numRows
        : Math.floor(previousY / fieldSize) < 0
        ? 0
        : Math.floor(previousY / fieldSize);
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
        <div className="flex gap-2 items-center font-roboto">
          <div className="flex flex-col items-center w-44">
            <div>
              <div>
                {viewMode.current === viewModes.SHORTEST_PATHING ? (
                  <div>Shortest pathing mode </div>
                ) : (
                  ""
                )}
              </div>
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
              <div className="flex gap-1 justify-around items-center">
                <p className="text-xs font-roboto text-slate-500">VIEW</p>
                <ViewIcon className="w-5 text-slate-500" />
              </div>
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
        <div className="flex font-bold font-roboto">
          {leftIsPressed.current || rightIsPressed.current ? (
            <h3 className="">
              [{previousFieldPressedX.current};{previousFieldPressedY.current}]
            </h3>
          ) : (
            ""
          )}

          <h3 className="">
            [{fieldPressedX.current};{fieldPressedY.current}]
          </h3>
        </div>

        <div className="flex gap-4">
          <div className="w-44">
            <Button
              fullWidth
              startIcon={<GraphIcon className="w-7 h-7" />}
              variant="contained"
              className="bg-slate-500 hover:bg-slate-600"
              onClick={() => {
                generateGraphButtonPressed();
              }}
            >
              Make a graph
            </Button>
          </div>

          <Button
            startIcon={<DijkstraIcon className="w-7 h-7" />}
            variant="contained"
            className="bg-fuchsia-700 hover:bg-fuchsia-800"
            onClick={() => {
              if (viewMode.current !== viewModes.SHORTEST_PATHING) {
                viewMode.current = viewModes.SHORTEST_PATHING;
                redraw();
              }
            }}
          >
            Shortest pathing tool
          </Button>
        </div>
      </div>
    </>
  );
}

export default Canvas;
