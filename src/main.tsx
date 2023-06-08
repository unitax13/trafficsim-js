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
let x: number | undefined;
let y: number | undefined;

canvas.addEventListener("mousedown", (e) => {
  isPressed = true;

  x = e.offsetX;
  y = e.offsetY;
});

document.addEventListener("mouseup", () => {
  isPressed = false;

  x = undefined;
  y = undefined;
});

canvas.addEventListener("mousemove", (e) => {
  if (isPressed && x !== undefined && y !== undefined) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;

    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);

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

colorEl.addEventListener("change", (e) => (color = e.target.value));

clearEl.addEventListener("click", () =>
  ctx?.clearRect(0, 0, canvas.width, canvas.height)
);

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
const fieldWidth = 6;
const fieldHeight = 6;
let cameraX = 0;
let cameraY = 0;
let cameraScale = 1;
let gridOpacity = 10;

drawMainGrid();
drawGridOverlay();

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
  for (let x = 0; x <= numRows; x++) {
    if (x % 10 == 0) {
      ctx!.lineWidth = (2 * gridOpacity) / 100;
    } else {
      ctx!.lineWidth = (0.5 * gridOpacity) / 100;
    }

    ctx!.moveTo(x * fieldWidth * cameraScale - cameraX, -1 - cameraY);
    ctx!.lineTo(
      x * fieldWidth * cameraScale - cameraX,
      canvasHeight * cameraScale - cameraY
    );

    ctx!.moveTo(-1 - cameraX, x * fieldWidth * cameraScale - cameraY);
    ctx!.lineTo(
      canvasWidth * cameraScale - cameraX,
      x * fieldWidth * cameraScale - cameraY
    );
  }
  ctx!.stroke();
}
