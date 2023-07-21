import Canvas from "./Canvas";
import "../index.css";
import FieldType from "../enums/FieldType";
import GraphNode from "../classes/GraphNode";
import { useRef } from "react";

function MainCanvasElement() {
  const numRows = 110;
  const numColumns = 110;
  const fieldArray = useRef<FieldType[][]>([]);

  const totalUrbanSegments = useRef<number>(0);
  const totalIndustrySegments = useRef<number>(0);
  const totalRoad1Segments = useRef<number>(0);

  // function initPopulation() {
  // Populate the array with a certain enum value
  const desiredFieldType = FieldType.Empty;

  for (let i = 0; i < numRows; i++) {
    fieldArray.current[i] = [];

    for (let j = 0; j < numColumns; j++) {
      fieldArray.current[i][j] = desiredFieldType;
    }
  }
  // dots to see if it works properly
  fieldArray.current[2][2] = FieldType.Road1;
  fieldArray.current[9][9] = FieldType.Industrial;
  updateStatsCount();
  // setStateFieldArray(fieldArray);
  // }

  function updateStatsCount() {
    totalRoad1Segments.current = 0;
    totalIndustrySegments.current = 0;
    totalUrbanSegments.current = 0;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        if (fieldArray.current[i][j] === FieldType.Road1) {
          totalRoad1Segments.current += 1;
        } else if (fieldArray.current[i][j] === FieldType.Road1) {
          totalRoad1Segments.current += 1;
        } else if (fieldArray.current[i][j] === FieldType.Urban) {
          totalUrbanSegments.current += 1;
        } else if (fieldArray.current[i][j] === FieldType.Industrial) {
          totalIndustrySegments.current += 1;
        }
      }
    }
  }

  function placePerpendicularLineBetween(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    fieldType: FieldType
  ) {
    if (Math.abs(bx - ax) > Math.abs(by - ay) && bx - ax >= 0) {
      //heading east
      for (let x = ax; x <= bx; x++) {
        if (fieldArray.current[x][ay] != FieldType.Road1) {
          fieldArray.current[x][ay] = fieldType;
        }
      }
    } else if (Math.abs(bx - ax) > Math.abs(by - ay) && bx - ax < 0) {
      //heading west
      for (let x = ax; x >= bx; x--) {
        if (fieldArray.current[x][ay] != FieldType.Road1) {
          fieldArray.current[x][ay] = fieldType;
        }
      }
    } else if (Math.abs(bx - ax) < Math.abs(by - ay) && by - ay < 0) {
      //heading south
      for (let y = ay; y >= by; y--) {
        if (fieldArray.current[ax][y] != FieldType.Road1) {
          fieldArray.current[ax][y] = fieldType;
        }
      }
    } else if (Math.abs(bx - ax) < Math.abs(by - ay) && by - ay >= 0) {
      //heading north
      for (let y = ay; y <= by; y++) {
        if (fieldArray.current[ax][y] != FieldType.Road1) {
          fieldArray.current[ax][y] = fieldType;
        }
      }
    }
    updateStatsCount();
  }

  function placeRectangleBetween(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    fieldType: FieldType
  ) {
    if (fieldType === FieldType.Road1) {
      placePerpendicularLineBetween(ax, ay, bx, by, fieldType);
    } else {
      console.log(`placeRectangleBetween ${ax} and ${ay} and ${bx} and ${by}`);
      let deltaX: number = bx - ax;
      let deltaY = by - ay;
      const signumDeltaX = Math.sign(deltaX);
      const signumDeltaY = Math.sign(deltaY);

      if (deltaX != 0 && deltaY != 0) {
        for (
          let y = ay - signumDeltaY;
          y != by && y >= 0 && y <= numRows;
          y += signumDeltaY
        ) {
          for (
            let x = ax - signumDeltaX;
            x != bx && x >= 0 && x <= numColumns;
            x += signumDeltaX
          ) {
            if (
              fieldArray.current[x + signumDeltaX][y + signumDeltaY] !=
                FieldType.Road1 ||
              fieldType == FieldType.Empty
            ) {
              fieldArray.current[x + signumDeltaX][y + signumDeltaY] =
                fieldType;
            }
          }
        }
      } else if (deltaY == 0) {
        let y = ay - signumDeltaY;
        for (
          let x = ax - signumDeltaX;
          x != bx && x >= 0 && x <= numColumns;
          x += signumDeltaX
        ) {
          if (
            fieldArray.current[x + signumDeltaX][y + signumDeltaY] !=
              FieldType.Road1 ||
            fieldType == FieldType.Empty
          ) {
            fieldArray.current[x + signumDeltaX][y + signumDeltaY] = fieldType;
          }
        }
      } else if (deltaX == 0) {
        let x = ax - signumDeltaX;
        for (
          let y = ay - signumDeltaY;
          y != by && y >= 0 && y <= numRows;
          y += signumDeltaY
        ) {
          if (
            fieldArray.current[x + signumDeltaX][y + signumDeltaY] !=
              FieldType.Road1 ||
            fieldType == FieldType.Empty
          ) {
            fieldArray.current[x + signumDeltaX][y + signumDeltaY] = fieldType;
          }
        }
      }
    }
    updateStatsCount();
  }

  function setFieldValue(x: number, y: number, value: FieldType) {
    //console.log("field ", x, " ", y, " set to ", value);
    if (x >= 0 && x < numRows && y >= 0 && y < numColumns) {
      fieldArray.current[x][y] = value;
    }
    updateStatsCount();
  }

  function generateGraph() {
    let width = numColumns;
    let height = numRows;

    let graphNodes: GraphNode[] = new Array();

    let data: FieldType[] = new Array();
    console.log(fieldArray.current.toString());
    for (let i = 0; i < height; i++) {
      if (width >= 0) {
        data = [...data, ...fieldArray.current[i]];
      }
    }
    console.log(data.toString());

    let start: GraphNode | null = null;
    let end: GraphNode | null = null;

    let topNodes = new Array<GraphNode | null>(width);
    let count: number = 0;

    let rowOffset: number = 0;
    let rowAboveOffset: number = 0;
    let rowBelowOffset: number = 0;

    let t: GraphNode | null = null;

    for (let y = 0; y < height; y++) {
      rowOffset = y * width;
      rowAboveOffset = rowOffset - width;
      rowBelowOffset = rowOffset + width;

      let prv: FieldType = FieldType.Empty;
      let cur: FieldType = FieldType.Empty;
      let nxt: FieldType = data[rowOffset + 1];

      let leftNode: GraphNode | null = null;

      for (let x = 0; x < width - 1; x++) {
        prv = cur;
        cur = nxt;
        nxt = data[rowOffset + x + 1];

        let n: GraphNode | null = null;

        if (cur != FieldType.Road1) {
          // ON WALL - No action
          continue;
        }

        if (prv == FieldType.Road1) {
          if (nxt == FieldType.Road1) {
            //PATH PATH PATH
            //Create node only if paths above or below
            if (
              data[rowAboveOffset + x] == FieldType.Road1 ||
              data[rowBelowOffset + x] == FieldType.Road1
            ) {
              n = new GraphNode(y, x);
              leftNode!.neighbours![1] = n;
              n!.neighbours![3] = leftNode;
              leftNode = n;
            }
          } else {
            // PATH PATH WALL
            //Create path at end of corridor
            n = new GraphNode(y, x);
            leftNode!.neighbours![1] = n;
            n!.neighbours![3] = leftNode;
            leftNode = null;
          }
        } else {
          if (nxt == FieldType.Road1) {
            //WALL PATH PATH
            //Create path at start of corridor
            n = new GraphNode(y, x);
            leftNode = n;
          } else {
            //WALL PATH WALL
            //Create node only if in dead end
            if (
              data[rowAboveOffset + x] != FieldType.Road1 ||
              data[rowBelowOffset + x] != FieldType.Road1
            ) {
              //System.out.println("Create node in dead end");
              n = new GraphNode(y, x);
            }
          }
        }

        if (n != null) {
          if (data[rowAboveOffset + x] == FieldType.Road1) {
            t = topNodes[x];
            t!.neighbours![2] = n;
            n!.neighbours![0] = t;
          }

          if (data[rowBelowOffset + x] == FieldType.Road1) {
            topNodes[x] = n;
          } else {
            topNodes[x] = null;
          }

          graphNodes.push(n);
          count++;
        }
      }
    }
    rowOffset = (height - 1) * width;
    for (let x = 0; x < width; x++) {
      if (data[rowOffset + x] == FieldType.Road1) {
        end = new GraphNode(height - 1, x);
        t = topNodes[x];
        t!.neighbours![2] = end;
        end!.neighbours![0] = t;

        graphNodes.push(end);
        count++;
        break;
      }
    }

    graphNodes.forEach((gn) => {
      for (let i = 0; i < gn!.neighbours!.length; i++) {
        let neighbour: GraphNode | null = gn.neighbours![i];
        if (neighbour != null) {
          let dist: number = Math.sqrt(
            (gn.x - neighbour.x) * (gn.x - neighbour.x) +
              (gn.y - neighbour.y) * (gn.y - neighbour.y)
          );
          gn.distances![i] = dist;

          for (let j = 0; j < neighbour.neighbours!.length; j++) {
            let n: GraphNode | null = neighbour.neighbours![j];
            if (n != null && n == gn) {
              neighbour.distances![j] = dist;
            }
          }
        }
      }
    });
    console.log("generated graph nodes");
    return graphNodes;
  }

  function setFieldArray(array: FieldType[][]) {
    console.log(JSON.stringify(array));

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        setFieldValue(i, j, array[i][j]);
      }
    }
  }

  //initPopulation();

  return (
    <>
      <div>
        <Canvas
          numRows={numRows}
          numColumns={numColumns}
          fieldArray={fieldArray.current}
          setFieldValue={setFieldValue}
          placeRectangleBetween={placeRectangleBetween}
          generateGraph={generateGraph}
          setFieldArray={setFieldArray}
          totalRoad1Segments={totalRoad1Segments}
          totalUrbanSegments={totalUrbanSegments}
          totalIndustrySegments={totalIndustrySegments}
        />
      </div>
    </>
  );
}

export default MainCanvasElement;
