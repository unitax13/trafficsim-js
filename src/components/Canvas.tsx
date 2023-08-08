import {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import "../index.css";
import { Button, Typography } from "@mui/material";
import FieldType from "../enums/FieldType";
import GraphNode from "../classes/GraphNode";
import Position from "../classes/Position";
import GraphIcon from "../icons/GraphIcon";
import "../colors";
import {
  drawCursorSingleSelection,
  drawGridOverlay,
  drawMainGrid,
  drawNodeNumbers,
  drawPositionPath,
  drawRectangularSelection,
  drawSegmentHighlight,
} from "../logic/drawingFunctions";
import DijkstraIcon from "../icons/DijkstraIcon";
import viewModes from "../enums/ViewModes";
import ShortestPathingClass from "../classes/ShortestPathingClass";
import StepperComponent from "./StepperComponent";
import ModeSelector from "./ModeSelector";
import BrushSection from "./BrushSection";
import ViewSettings from "./ViewSettings";
import LoadIcon from "../icons/LoadIcon";
import SaveIcon from "../icons/SaveIcon";
import SegmentsContainer from "../classes/SegmentsContainer";
import ConnectionIcon from "../icons/ConnectionIcon";
import ExaminationClass from "../classes/ExaminationClass";
import QuestionMark from "../icons/QuestionMark";

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
  setFieldArray: (array: FieldType[][]) => void;
  totalRoad1Segments: React.MutableRefObject<number>;
  totalUrbanSegments: React.MutableRefObject<number>;
  totalIndustrySegments: React.MutableRefObject<number>;
}

function Canvas(props: CanvasProps) {
  const graphNodesRef = useRef<GraphNode[] | null | undefined>(null);
  let color = "black";
  const canvasWidth = 800;
  const canvasHeight = 700;

  const shortestPathingClassInstance = useRef<ShortestPathingClass | null>(
    null
  );

  const intervalId = useRef<any>(null);

  const examinationInstance = useRef<ExaminationClass | null>(null);
  const messagesRef = useRef<string[]>([]);

  const positionPathToDrawRef = useRef<Position[]>([]);
  const highlightedSegmentPositions = useRef<Position[] | null>(null);
  const distanceToTargetRef = useRef<number>(0);
  const segmentsContainerClassInstance = useRef<SegmentsContainer | null>(null);

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
  const [pathIsOn, setPathIsOn] = useState<boolean>(true);
  const [segmentHighlightIsOn, setSegmentHighlightIsOn] =
    useState<boolean>(true);
  const [heatmapIsOn, setHeatmapIsOn] = useState<boolean>(true);

  const heatmapColorArray = useRef<string[][]>([]);

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
      heatmapIsOn,
      heatmapColorArray.current,
      cameraScale,
      cameraX,
      cameraY
    );

    // init the heatmap color array
    for (let i = 0; i < props.numRows; i++) {
      heatmapColorArray.current[i] = new Array(props.numColumns).fill("");
    }
    //heatmapColorArray.current[32][30] = "#eeeeee";
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
      heatmapIsOn,
      heatmapColorArray.current,
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
      cameraScale,
      viewMode.current
    );
    if (
      viewMode.current === viewModes.NORMAL &&
      (leftIsPressed.current || rightIsPressed.current)
    ) {
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

    if (pathIsOn && positionPathToDrawRef.current) {
      drawPositionPath(
        ctx,
        positionPathToDrawRef,
        props.numRows,
        props.numColumns,
        fieldSize,
        cameraScale,
        cameraX,
        cameraY
      );
    }

    if (
      segmentHighlightIsOn &&
      highlightedSegmentPositions.current &&
      highlightedSegmentPositions.current.length > 0
    ) {
      drawSegmentHighlight(
        ctx,
        highlightedSegmentPositions.current,
        props.numRows,
        props.numColumns,
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
    console.log("redraw is called");
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
    //console.log("Mouse over ", fieldPressedX, fieldPressedY);
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
    if (viewMode.current === viewModes.NORMAL) {
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
    } else if (viewMode.current === viewModes.SHORTEST_PATHING) {
      if (shortestPathingClassInstance.current != null) {
        shortestPathingClassInstance.current.add(
          new Position(fieldPressedX.current, fieldPressedY.current)
        );
      }
    } else if (viewMode.current === viewModes.EXAMINATION) {
      if (examinationInstance.current) {
        console.log("showing path");
        examinationInstance.current.showPath(
          fieldPressedX.current,
          fieldPressedY.current
        );
      }
    }
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
    if (viewMode.current === viewModes.NORMAL) {
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
    }

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
    fieldPressedX.current = -1;
    fieldPressedY.current = -1;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    console.log(e.key);
  };

  function generateGraphButtonPressed() {
    graphNodesRef.current = props.generateGraph();
    if (graphNodesRef.current !== undefined) {
      // console.log("not undefined ", graphNodesRef.current.length);
      graphNodesRef.current.forEach((node: GraphNode) => {
        // console.log("hello");
        // console.log(node.x, node.y);
        // console.log(node.distances!.toString());
      });
    }
    redraw();
  }

  function onLoadButtonPressed(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
    console.log("Loaded file...");

    const file = e.target.files[0];
    const { name } = file;

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const fileContent = e.target?.result;
          const parsedData = JSON.parse(fileContent as string);

          // Access the data and version from the uploaded file
          const { data, version } = parsedData;

          // Perform any necessary processing with the data
          // Set the uploadedData variable based on the contents of the file
          props.setFieldArray(data);

          console.log("File version:", version);

          // Upload the file to the server or perform further actions
          // Here, you can invoke an API endpoint to send the file content
          // Example: uploadFileToServer(parsedData);
        } catch (error) {
          console.error("Error reading file:", error);
        }
      };

      reader.readAsText(file);
    }
  }

  function onSaveButtonPressed(e: any) {
    console.log("onSaveButtonPressed");

    const fileContent = JSON.stringify({
      version: "1.0",
      data: props.fieldArray,
    });
    const file = new Blob([fileContent], { type: "application/json" });

    const url = URL.createObjectURL(file); // Step 2: Create a downloadable URL
    const link = document.createElement("a");
    link.href = url; // Set the href attribute to the downloadable URL
    link.download = "data.json"; // Step 4: Specify the desired file name

    document.body.appendChild(link); // Append the <a> element to the DOM
    link.click(); // Step 5: Programmatically trigger a click event to start the download

    document.body.removeChild(link); // Remove the <a> element from the DOM after the download
    URL.revokeObjectURL(url); // Revoke the downloadable URL to free up memory
  }

  const initShortestPathing = () => {
    if (graphNodesRef.current != null) {
      shortestPathingClassInstance.current = new ShortestPathingClass(
        props.fieldArray,
        graphNodesRef.current,
        positionPathToDrawRef,
        distanceToTargetRef,
        highlightedSegmentPositions,
        redraw
      );
    } else {
      console.log("Graph not yet generated. Generate it!");
    }
  };

  const handleModeChange = (e: any) => {
    viewMode.current = e.target.value;

    if (viewMode.current !== viewModes.EXAMINATION) {
      highlightedSegmentPositions.current = null;
    }

    if (viewMode.current === viewModes.SHORTEST_PATHING) {
      initShortestPathing();
    }

    if (viewMode.current === viewModes.EXAMINATION) {
      if (graphNodesRef.current && segmentsContainerClassInstance.current) {
        examinationInstance.current = new ExaminationClass(
          props.fieldArray,
          segmentsContainerClassInstance,
          positionPathToDrawRef,
          highlightedSegmentPositions,
          distanceToTargetRef,
          messagesRef,
          redraw
        );
      }
    }
    console.log(e.target);
    redraw();
  };

  const shortestPathingToolButtonPressed = (e: any) => {
    if (viewMode.current !== viewModes.SHORTEST_PATHING) {
      viewMode.current = viewModes.SHORTEST_PATHING;
    }

    initShortestPathing();

    redraw();
  };

  const handleFieldTypeChosen = (e: FieldType) => {
    fieldTypeChosen.current = e;
    viewMode.current = viewModes.NORMAL;
    redraw();
  };

  const examineButtonPressed = () => {
    if (viewMode.current !== viewModes.EXAMINATION) {
      viewMode.current = viewModes.EXAMINATION;
    }
    if (graphNodesRef.current && segmentsContainerClassInstance.current) {
      examinationInstance.current = new ExaminationClass(
        props.fieldArray,
        segmentsContainerClassInstance,
        positionPathToDrawRef,
        highlightedSegmentPositions,
        distanceToTargetRef,
        messagesRef,
        redraw
      );
    }
    redraw();
  };

  const bindButtonPressed = () => {
    if (graphNodesRef.current != null) {
      console.log("Binding");

      // make a new segments container
      // add all urban and industry segments to it
      segmentsContainerClassInstance.current = new SegmentsContainer(
        props.fieldArray,
        graphNodesRef.current
      );
      // bind them
      segmentsContainerClassInstance.current.bindRandomly(false);

      segmentsContainerClassInstance.current.urbanSegments.forEach((us) => {
        us.calculateClosestRoadSegment(props.fieldArray, 10);
        us.findClosestRoadNodes(props.fieldArray, graphNodesRef.current!);
      });

      segmentsContainerClassInstance.current.industrySegments.forEach((is) => {
        is.calculateClosestRoadSegment(props.fieldArray, 10);
        is.findClosestRoadNodes(props.fieldArray, graphNodesRef.current!);
      });

      console.log("Urban segments stats:");
      segmentsContainerClassInstance.current.urbanSegments.forEach((us) => {
        us.printSegmentStats2();
      });
      console.log("industry segments stats:");
      segmentsContainerClassInstance.current.industrySegments.forEach((is) => {
        is.printSegmentStats2();
      });

      console.log("Finding paths...");

      // make each find its way to the corresponding segment
      segmentsContainerClassInstance.current.urbanSegments.forEach((us) => {
        us.findPathToBoundSegment(graphNodesRef.current!, -1, true);
      });

      segmentsContainerClassInstance.current.printUrbanSegments();
    }
  };

  const testButtonPressed = () => {
    // const timer = setTimeout(() => {
    //   // This code will run after the specified time (in milliseconds)
    //   props.setFieldValue(20, 20, FieldType.Road1);
    //   redraw();
    // }, 3000); // 3000 milliseconds (3 seconds)

    // // Clear the timer if the component unmounts or if you want to cancel it early
    // return () => clearTimeout(timer);

    intervalId.current = setInterval(() => {
      // Code to execute
      console.log("This code runs every 1 second.");
      props.setFieldValue(20, 20, FieldType.Road1);
      redraw();
    }, 1000);
  };

  const stopButtonPressed = () => {
    clearInterval(intervalId.current);
  };

  return (
    <>
      <div className=" font-roboto">
        <div className="flex gap-2 items-center">
          {/* <div className="flex flex-col items-center w-44"> */}
          <div className="h-[666px] grid grid-rows-[12] gap-4 w-44">
            <div className="row-span-1 flex w-full">
              <Button
                component="label"
                fullWidth
                variant="outlined"
                className="h-3/4"
                startIcon={<LoadIcon className=" w-3.5 h-4" />}
                //onClick={onLoadButtonPressed}
              >
                LOAD
                <input
                  id="select-image"
                  accept="json"
                  type="file"
                  hidden
                  onChange={onLoadButtonPressed}
                />
              </Button>
              <Button
                fullWidth
                variant="outlined"
                className="h-3/4"
                endIcon={<SaveIcon className="w-4 h-4" />}
                onClick={onSaveButtonPressed}
              >
                Save
              </Button>
            </div>
            <div className="">
              <ModeSelector
                viewMode={viewMode}
                handleModeChange={handleModeChange}
              />
            </div>
            <div className="outline outline-slate-50 outline-solid outline-2 row-span-1 flex flex-col justify-around w-full">
              <BrushSection onFieldChosen={handleFieldTypeChosen} />
            </div>
            <div className="mt-4 w-full row-span-2 flex flex-col items-center ">
              <ViewSettings
                roadsIsOn={roadsIsOn}
                setRoadsIsOn={setRoadsIsOn}
                urbanIsOn={urbanIsOn}
                setUrbanIsOn={setUrbanIsOn}
                industryIsOn={industryIsOn}
                setIndustryIsOn={setIndustryIsOn}
                nodeNumbersAreOn={nodeNumbersAreOn}
                setNodeNumbersAreOn={setNodeNumbersAreOn}
                gridIsOn={gridIsOn}
                setGridIsOn={setGridIsOn}
                pathIsOn={pathIsOn}
                setPathIsOn={setPathIsOn}
                segmentHighlightIsOn={segmentHighlightIsOn}
                setSegmentHighlightIsOn={setSegmentHighlightIsOn}
                redraw={redraw}
                heatmapIsOn={heatmapIsOn}
                setHeatmapIsOn={setHeatmapIsOn}
              />
            </div>
            <div className="row-span-2 flex flex-col">
              {/* X,Y text */}
              <div className="flex font-bold font-roboto">
                {leftIsPressed.current || rightIsPressed.current ? (
                  <h3 className="">
                    [{previousFieldPressedX.current};
                    {previousFieldPressedY.current}]
                  </h3>
                ) : (
                  ""
                )}

                <h3 className="">
                  [{fieldPressedX.current};{fieldPressedY.current}]
                </h3>
              </div>
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
          {/* start of stepper section */}
          {positionPathToDrawRef.current &&
          positionPathToDrawRef.current.length > 0 ? (
            <div className="flex flex-col">
              <StepperComponent
                positionPath={positionPathToDrawRef.current}
                distanceToTarget={distanceToTargetRef.current}
                messages={messagesRef}
              />
            </div>
          ) : (
            ""
          )}
          {/* end of stepper section */}
        </div>

        <div className="pt-2 flex gap-4 h-10">
          <div className="w-44">
            <Button
              fullWidth
              startIcon={<GraphIcon className="w-7 h-7" />}
              variant="contained"
              className="bg-slate-500 hover:bg-slate-600 h-full"
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
            onClick={(e) => {
              shortestPathingToolButtonPressed(e);
            }}
          >
            Shortest pathing tool
          </Button>

          <div>
            <Button
              className="h-full bg-blue-600 hover:bg-blue-700"
              variant="contained"
              startIcon={<ConnectionIcon className="w-6 h-6" />}
              onClick={bindButtonPressed}
            >
              Bind randomly
            </Button>
          </div>
          <Button
            className="h-full bg-sky-600 hover:bg-sky-700"
            variant="contained"
            startIcon={<QuestionMark className="w-6 h-6" />}
            onClick={examineButtonPressed}
          >
            Examine
          </Button>
          <Button
            className="h-full bg-red-600 hover:bg-red-700"
            variant="contained"
            startIcon={<QuestionMark className="w-6 h-6" />}
            onClick={testButtonPressed}
          >
            TEST
          </Button>
          <Button
            className="h-full bg-red-600 hover:bg-red-700"
            variant="contained"
            startIcon={<QuestionMark className="w-6 h-6" />}
            onClick={stopButtonPressed}
          >
            STOP
          </Button>
        </div>
        <div className="my-2 text-slate-700">
          <Typography className="text-sm ">
            Urban segments: <span>{props.totalUrbanSegments.current}</span>
          </Typography>
          <Typography className=" border-y-0 border-b-2 border-x-0 border-solid border-slate-300  text-sm">
            Industry segments:{" "}
            <span>{props.totalIndustrySegments.current}</span>
          </Typography>
          <Typography className=" text-sm">
            Total roads length: <span>{props.totalRoad1Segments.current}</span>
          </Typography>
        </div>
      </div>
    </>
  );
}

export default Canvas;
