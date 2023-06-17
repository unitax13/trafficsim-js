import Canvas from "./Canvas";
import "../index.css";
import { Button } from "@mui/material";
import { useState } from "react";
import FieldType from "../enums/FieldType";

function MainCanvasElement() {
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
        if (fieldArray[x][ay] != FieldType.Road1) {
          fieldArray[x][ay] = fieldType;
        }
      }
    } else if (Math.abs(bx - ax) > Math.abs(by - ay) && bx - ax < 0) {
      //heading west
      for (let x = ax; x >= bx; x--) {
        if (fieldArray[x][ay] != FieldType.Road1) {
          fieldArray[x][ay] = fieldType;
        }
      }
    } else if (Math.abs(bx - ax) < Math.abs(by - ay) && by - ay < 0) {
      //heading south
      for (let y = ay; y >= by; y--) {
        if (fieldArray[ax][y] != FieldType.Road1) {
          fieldArray[ax][y] = fieldType;
        }
      }
    } else if (Math.abs(bx - ax) < Math.abs(by - ay) && by - ay >= 0) {
      //heading north
      for (let y = ay; y <= by; y++) {
        if (fieldArray[ax][y] != FieldType.Road1) {
          fieldArray[ax][y] = fieldType;
        }
      }
    }
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
              fieldArray[x + signumDeltaX][y + signumDeltaY] !=
                FieldType.Road1 ||
              fieldType == FieldType.Empty
            ) {
              fieldArray[x + signumDeltaX][y + signumDeltaY] = fieldType;
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
            fieldArray[x + signumDeltaX][y + signumDeltaY] != FieldType.Road1 ||
            fieldType == FieldType.Empty
          ) {
            fieldArray[x + signumDeltaX][y + signumDeltaY] = fieldType;
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
            fieldArray[x + signumDeltaX][y + signumDeltaY] != FieldType.Road1 ||
            fieldType == FieldType.Empty
          ) {
            fieldArray[x + signumDeltaX][y + signumDeltaY] = fieldType;
          }
        }
      }
    }
  }

  const numRows = 110;
  const numColumns = 110;
  let fieldArray: FieldType[][] = [];
  // const [stateFieldArray, setStateFieldArray] = useState<FieldType[][]>();

  // function initPopulation() {
  // Populate the array with a certain enum value
  const desiredFieldType = FieldType.Empty;

  for (let i = 0; i < numRows; i++) {
    fieldArray[i] = [];

    for (let j = 0; j < numColumns; j++) {
      fieldArray[i][j] = desiredFieldType;
    }
  }
  // dots to see if it works properly
  fieldArray[2][2] = FieldType.Road1;
  fieldArray[9][9] = FieldType.Industrial;
  // setStateFieldArray(fieldArray);
  // }

  function setFieldValue(x: number, y: number, value: FieldType) {
    console.log("field ", x, " ", y, " set to ", value);
    if (x >= 0 && x < numRows && y >= 0 && y < numColumns) {
      fieldArray[x][y] = value;
    }
    // setStateFieldArray(fieldArray);
  }

  //initPopulation();

  return (
    <>
      <div>
        <Canvas
          numRows={numRows}
          numColumns={numColumns}
          fieldArray={fieldArray}
          setFieldValue={setFieldValue}
          placeRectangleBetween={placeRectangleBetween}
        />
      </div>
    </>
  );
}

export default MainCanvasElement;
