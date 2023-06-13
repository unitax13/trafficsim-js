import Canvas from "./Canvas";
import "../index.css";
import { Button } from "@mui/material";
import { useState } from "react";
import FieldType from "../enums/FieldType";

function MainCanvasElement() {
  const canvasWidth = 800;
  const canvasHeight = 700;

  // canvas.addEventListener("mousedown", (e) => {
  //   isPressed = true;

  //   x = e.offsetX;
  //   y = e.offsetY;
  //   updateCoordsOfFieldWithMousePREVIOUSLYOn(x, y);
  //   updateCoordsOfFieldWithMouseOn(x, y);

  //   fieldArray[fieldPressedX][fieldPressedY] = fieldTypeChosen;

  //   drawMainGrid();

  //   console.log("fieldPressed: ", fieldPressedX, fieldPressedY);
  // });

  // document.addEventListener("mouseup", (e) => {
  //   // console.log("Is pressed set to false", e.offsetX, e.offsetY);
  //   updateCoordsOfFieldWithMouseOn(e.offsetX, e.offsetY);
  //   console.log(
  //     "fieldPressed: ",
  //     previousFieldPressedX,
  //     previousFieldPressedY,
  //     "fieldReleased: ",
  //     fieldPressedX,
  //     fieldPressedY
  //   );

  //   placeRectangleBetween(
  //     previousFieldPressedX,
  //     previousFieldPressedY,
  //     fieldPressedX,
  //     fieldPressedY,
  //     fieldTypeChosen
  //   );
  //   redraw();
  //   isPressed = false;

  //   x = undefined;
  //   y = undefined;
  // });

  // canvas.addEventListener("mousemove", (e) => {
  //   if (isPressed && x !== undefined && y !== undefined) {
  //     const x2 = e.offsetX;
  //     const y2 = e.offsetY;

  //     previousMouseX = x;
  //     previousMouseY = y;

  //     x = x2;
  //     y = y2;
  //   }
  // });

  function placeRectangleBetween(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    fieldType: FieldType
  ) {
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
            fieldArray[x + signumDeltaX][y + signumDeltaY] != FieldType.Road1 ||
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

  const numRows = 100;
  const numColumns = 100;
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

  // console.log(13 % 5);
  // redraw();

  function redraw() {
    //render call
    // draw empty grid, then draw non-empty fields on top of it
    drawMainGrid();

    //if not mouse dragging, then draw selection. if mouse dragging, then draw perpendicular selection
    // if (!isPressed) {
    //   drawSingleSelection();
    // } else {
    //   // when it IS dragging
    //   drawPerpendicularSelection();
    // }

    // drawCoordsLabel();

    //optionally draw grid overlay
    //drawGridOverlay();

    // nodeNumbersAreOn ? drawNodeNumbers() : null;
    // pathIsOn ? drawPath() : null;
    // roadHeatmapIsOn ? drawRoadHeatOverlay() : null;
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
