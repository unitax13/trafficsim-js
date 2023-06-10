const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const increaseBtn = document.getElementById("increase") as HTMLButtonElement;
const decreaseBtn = document.getElementById("decrease") as HTMLButtonElement;
const sizeEL = document.getElementById("size") as HTMLSpanElement;
const colorEl = document.getElementById("color") as HTMLInputElement;
const clearEl = document.getElementById("clear") as HTMLButtonElement;

const ctx = canvas.getContext("2d");

const canvasWidth = 800;
const canvasHeight = 700;

let size = 10;
let isPressed = false;
colorEl.value = "black";
let color = colorEl.value;
let previousMouseX: number | undefined;
let previousMouseY: number | undefined;
let x: number | undefined;
let y: number | undefined;

let previousFieldPressedX: number = 0;
let previousFieldPressedY: number = 0;
let fieldPressedX: number = 0;
let fieldPressedY: number = 0;

function updateCoordsOfFieldWithMouseOn(x: number, y: number) {
  fieldPressedX = Math.floor(x / fieldWidth);
  fieldPressedY = Math.floor(y / fieldHeight);
}

function updateCoordsOfFieldWithMousePREVIOUSLYOn(
  previousX: number,
  previousY: number
) {
  previousFieldPressedX = Math.floor(previousX / fieldWidth);
  previousFieldPressedY = Math.floor(previousY / fieldHeight);
}

canvas.addEventListener("mousedown", (e) => {
  isPressed = true;

  x = e.offsetX;
  y = e.offsetY;
  updateCoordsOfFieldWithMousePREVIOUSLYOn(x, y);
  updateCoordsOfFieldWithMouseOn(x, y);

  fieldArray[fieldPressedX][fieldPressedY] = FieldType.Road1;

  drawMainGrid();

  console.log("fieldPressed: ", fieldPressedX, fieldPressedY);
});

document.addEventListener("mouseup", (e) => {
  // console.log("Is pressed set to false", e.offsetX, e.offsetY);
  updateCoordsOfFieldWithMouseOn(e.offsetX, e.offsetY);
  console.log(
    "fieldPressed: ",
    previousFieldPressedX,
    previousFieldPressedY,
    "fieldReleased: ",
    fieldPressedX,
    fieldPressedY
  );

  placeRectangleBetween(
    previousFieldPressedX,
    previousFieldPressedY,
    fieldPressedX,
    fieldPressedY,
    FieldType.Urban
  );
  redraw();
  isPressed = false;

  x = undefined;
  y = undefined;
});

canvas.addEventListener("mousemove", (e) => {
  if (isPressed && x !== undefined && y !== undefined) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;

    previousMouseX = x;
    previousMouseY = y;

    x = x2;
    y = y2;
  }
});

function drawCircle(x: number, y: number) {
  ctx?.beginPath();
  ctx?.arc(x, y, size, 0, Math.PI * 2);
  ctx!.fillStyle = color;
  ctx?.fill();
}

function drawLine(x1: number, y1: number, x2: number, y2: number) {
  ctx?.beginPath();
  ctx?.moveTo(x1, y1);
  ctx?.lineTo(x2, y2);
  ctx!.strokeStyle = color;
  ctx!.lineWidth = size * 2;
  ctx?.stroke();
}

function updateSizeOnScreen() {
  sizeEL.innerText = size.toString();
}

increaseBtn.addEventListener("click", () => {
  size += 5;

  if (size > 50) {
    size = 50;
  }

  updateSizeOnScreen();
});

decreaseBtn.addEventListener("click", () => {
  size -= 5;

  if (size < 5) {
    size = 5;
  }

  updateSizeOnScreen();
});

function placeRectangleBetween(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  fieldType: FieldType
) {
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

enum FieldType {
  Empty,
  Road1,
  Urban,
  Industrial,
}

const numRows = 100;
const numColumns = 100;
const fieldArray: FieldType[][] = [];

// Populate the array with a certain enum value
const desiredFieldType = FieldType.Empty;

for (let i = 0; i < numRows; i++) {
  fieldArray[i] = [];

  for (let j = 0; j < numColumns; j++) {
    fieldArray[i][j] = desiredFieldType;
  }
}

fieldArray[10][10] = FieldType.Road1;
fieldArray[20][20] = FieldType.Industrial;

ctx!.fillStyle = "red";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

const urbanIsOn = true;
const industryIsOn = true;
const roadsIsOn = true;
const nodeNumbersAreOn = false;
const pathIsOn = false;
const roadHeatmapIsOn = false;

let isDragging = false;

const fieldWidth = 6;
const fieldHeight = 6;
let cameraX = 0;
let cameraY = 0;
let cameraScale = 1;
let gridOpacity = 10;

console.log(13 % 5);
redraw();

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

function drawMainGrid() {
  for (let x = 0; x < numRows; x++) {
    for (let y = 0; y < numColumns; y++) {
      let type: FieldType = fieldArray[x][y];
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

function drawGridOverlay() {
  console.log("drawing grid overlay");
  ctx!.strokeStyle = "#111111";
  for (let x1 = 0; x1 <= numRows; x1++) {
    ctx!.lineWidth = (1 * gridOpacity) / 100;

    ctx!.moveTo(x1 * fieldWidth * cameraScale - cameraX, -1 - cameraY);
    ctx!.lineTo(
      x1 * fieldWidth * cameraScale - cameraX,
      canvasHeight * cameraScale - cameraY
    );

    ctx!.moveTo(-1 - cameraX, x1 * fieldWidth * cameraScale - cameraY);
    ctx!.lineTo(
      canvasWidth * cameraScale - cameraX,
      x1 * fieldWidth * cameraScale - cameraY
    );
    ctx!.stroke();
  }
}
