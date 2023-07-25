import GraphNode from "../classes/GraphNode";
import Position from "../classes/Position";
import colors from "../colors";
import FieldType from "../enums/FieldType";
import viewModes from "../enums/ViewModes";

export function drawGridOverlay(
  /// change that to use the alpha rather than line width
  ctx: CanvasRenderingContext2D,
  numRows: number,
  fieldSize: number,
  cameraScale: number,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx!.strokeStyle = "#111111";
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  for (let i = 0; i <= numRows; i++) {
    //ctx!.strokeStyle = "#111111";
    ctx.lineWidth = 1;

    ctx.moveTo(i * fieldSize * cameraScale - cameraX, -1 - cameraY);
    ctx.lineTo(
      i * fieldSize * cameraScale - cameraX,
      canvasHeight * cameraScale - cameraY
    );

    ctx.moveTo(-1 - cameraX, i * fieldSize * cameraScale - cameraY);
    ctx.lineTo(
      canvasWidth * cameraScale - cameraX,
      i * fieldSize * cameraScale - cameraY
    );
  }
  ctx.stroke();
  //ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawNodeNumbers(
  ctx: CanvasRenderingContext2D,
  graphNodesRef: React.MutableRefObject<GraphNode[] | null | undefined>,
  fieldSize: number,
  cameraScale: number
) {
  if (graphNodesRef.current) {
    for (let i = 0; i < graphNodesRef.current.length; i++) {
      let node: GraphNode = graphNodesRef.current[i];
      let color = "black";
      ctx!.fillStyle = color;
      ctx.fillText(
        i.toString(),
        node.x * fieldSize * cameraScale + fieldSize * cameraScale,
        node.y * fieldSize * cameraScale,
        fieldSize * cameraScale
      );
    }
  }
}

export function drawSegmentHighlight(
  ctx: CanvasRenderingContext2D,
  highlightedSegmentPositions: Position[],
  numRows: number,
  numColumns: number,
  fieldSize: number,
  cameraScale: number,
  cameraX: number,
  cameraY: number
) {
  let color = colors.highlightColor;
  ctx!.fillStyle = color;

  for (const pos of highlightedSegmentPositions) {
    ctx!.fillRect(
      fieldSize * 1 * pos.x - cameraX,
      fieldSize * cameraScale * pos.y - cameraY,
      fieldSize * cameraScale,
      fieldSize * cameraScale
    );
  }
}

export function drawPositionPath(
  ctx: CanvasRenderingContext2D,
  positionPathToDrawRef: React.MutableRefObject<Position[]>,
  numRows: number,
  numColumns: number,
  fieldSize: number,
  cameraScale: number,
  cameraX: number,
  cameraY: number
) {
  let color = colors.pathColor;
  ctx!.fillStyle = color;

  for (let i = 1; i < positionPathToDrawRef.current.length; i++) {
    let posFrom = positionPathToDrawRef.current[i - 1];
    let posTo = positionPathToDrawRef.current[i];

    if (posFrom.x < posTo.x) {
      // console.log(
      //   "drawin from left to right from ",
      //   posFrom.x,
      //   ";",
      //   posFrom.y,
      //   " to ",
      //   posTo.x,
      //   ";",
      //   posTo.y
      // );
      ctx.fillRect(
        posFrom.x * fieldSize * cameraScale,
        posFrom.y * fieldSize * cameraScale,
        posTo.x * fieldSize * cameraScale +
          fieldSize -
          posFrom.x * fieldSize * cameraScale,
        posTo.y * fieldSize * cameraScale +
          fieldSize -
          posFrom.y * fieldSize * cameraScale
      );
    } else if (posFrom.x > posTo.x) {
      // console.log(
      //   "from right to left from ",
      //   posFrom.x,
      //   ";",
      //   posFrom.y,
      //   " to ",
      //   posTo.x,
      //   ";",
      //   posTo.y
      // );
      ctx.fillRect(
        posFrom.x * fieldSize * cameraScale + fieldSize,
        posFrom.y * fieldSize * cameraScale,
        posTo.x * fieldSize * cameraScale - posFrom.x * fieldSize * cameraScale,
        posTo.y * fieldSize * cameraScale +
          fieldSize -
          posFrom.y * fieldSize * cameraScale
      );
    } else if (posFrom.y < posTo.y) {
      // going down
      // console.log(
      //   "down from ",
      //   posFrom.x,
      //   ";",
      //   posFrom.y,
      //   " to ",
      //   posTo.x,
      //   ";",
      //   posTo.y
      // );
      ctx.fillRect(
        posFrom.x * fieldSize * cameraScale,
        posFrom.y * fieldSize * cameraScale,
        posTo.x * fieldSize * cameraScale +
          fieldSize -
          posFrom.x * fieldSize * cameraScale,
        posTo.y * fieldSize * cameraScale +
          fieldSize -
          posFrom.y * fieldSize * cameraScale
      );
    } else if (posFrom.y > posTo.y) {
      // going up
      // console.log(
      //   "up from ",
      //   posFrom.x,
      //   ";",
      //   posFrom.y,
      //   " to ",
      //   posTo.x,
      //   ";",
      //   posTo.y
      // );
      ctx.fillRect(
        posFrom.x * fieldSize * cameraScale,
        posFrom.y * fieldSize * cameraScale + fieldSize,
        posTo.x * fieldSize * cameraScale +
          fieldSize -
          posFrom.x * fieldSize * cameraScale,
        posTo.y * fieldSize * cameraScale - posFrom.y * fieldSize * cameraScale
      );
    } else {
      ctx.fillRect(
        posFrom.x * fieldSize * cameraScale,
        posFrom.y * fieldSize * cameraScale,
        posTo.x * fieldSize * cameraScale +
          fieldSize -
          posFrom.x * fieldSize * cameraScale,
        posTo.y * fieldSize * cameraScale +
          fieldSize -
          posFrom.y * fieldSize * cameraScale
      );
    }
  }
}

export function drawMainGrid(
  ctx: CanvasRenderingContext2D,
  numRows: number,
  numColumns: number,
  fieldArray: FieldType[][],
  urbanIsOn: boolean,
  industryIsOn: boolean,
  roadsIsOn: boolean,
  fieldSize: number,

  cameraScale: number,
  cameraX: number,
  cameraY: number
) {
  //console.log("drawing");
  let color = "";
  for (let x = 0; x < numRows; x++) {
    for (let y = 0; y < numColumns; y++) {
      let type = fieldArray[x][y];
      if (type == FieldType.Urban && urbanIsOn) {
        color = colors.urban;
      } else if (type == FieldType.Industrial && industryIsOn) {
        color = colors.industry;
      } else if (type == FieldType.Road1 && roadsIsOn) {
        color = colors.roads;
      } else {
        // EMPTY
        color = colors.empty;
      }
      ctx!.fillStyle = color;

      ctx!.fillRect(
        fieldSize * 1 * x - cameraX,
        fieldSize * cameraScale * y - cameraY,
        fieldSize * cameraScale,
        fieldSize * cameraScale
      );
    }
  }
}

export function drawRectangularSelection(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  fieldTypeChosen: React.MutableRefObject<FieldType>,
  rightIsPressed: React.MutableRefObject<boolean>,
  fieldSize: number,
  cameraScale: number,
  cameraX: number,
  cameraY: number
) {
  let deltaX = bx - ax;
  let deltaY = by - ay;
  let signumDeltaX = Math.sign(deltaX);
  let signumDeltaY = Math.sign(deltaY);

  let color = "";

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
          fieldSize * cameraScale * ax - cameraX,
          fieldSize * cameraScale * ay - cameraY,
          fieldSize * cameraScale * deltaX,
          fieldSize * cameraScale
        );
      } else {
        ctx!.fillRect(
          fieldSize * cameraScale * bx - cameraX,
          fieldSize * cameraScale * ay - cameraY,
          -fieldSize * cameraScale * deltaX,
          fieldSize * cameraScale
        );
      }
    } else {
      if (deltaY >= 0) {
        ctx!.fillRect(
          fieldSize * cameraScale * ax - cameraX,
          fieldSize * cameraScale * ay - cameraY,
          fieldSize * cameraScale,
          fieldSize * cameraScale * deltaY
        );
      } else {
        ctx!.fillRect(
          fieldSize * cameraScale * ax - cameraX,
          fieldSize * cameraScale * by - cameraY,
          fieldSize * cameraScale,
          -fieldSize * cameraScale * deltaY
        );
      }
    }
  } else {
    if (signumDeltaX >= 0 && signumDeltaY >= 0) {
      //heading south-east
      ctx!.fillRect(
        fieldSize * cameraScale * ax - cameraX,
        fieldSize * cameraScale * ay - cameraY,
        fieldSize * cameraScale * (deltaX + 1),
        fieldSize * cameraScale * (deltaY + 1)
      );
    } else if (signumDeltaX >= 0 && signumDeltaY < 0) {
      //heading north-east
      ctx!.fillRect(
        fieldSize * cameraScale * ax - cameraX,
        fieldSize * cameraScale * by - cameraY,
        fieldSize * cameraScale * (deltaX + 1),
        -fieldSize * cameraScale * (deltaY - 1)
      );
    } else if (signumDeltaX < 0 && signumDeltaY < 0) {
      //heading north-west
      ctx!.fillRect(
        fieldSize * cameraScale * bx - cameraX,
        fieldSize * cameraScale * by - cameraY,
        -fieldSize * cameraScale * (deltaX - 1),
        -fieldSize * cameraScale * (deltaY - 1)
      );
    } else if (signumDeltaX < 0 && signumDeltaY >= 0) {
      //heading south-west
      ctx!.fillRect(
        fieldSize * cameraScale * bx - cameraX,
        fieldSize * cameraScale * ay - cameraY,
        -fieldSize * cameraScale * (deltaX - 1),
        fieldSize * cameraScale * (deltaY + 1)
      );
    }
  }
  //}

  ctx.globalAlpha = 1;
  //ctx!.setGlobalBlendMode(BlendMode.SRC_OVER);
}

export function drawCursorSingleSelection(
  ctx: CanvasRenderingContext2D,
  leftIsPressed: React.MutableRefObject<boolean>,
  fieldPressedX: React.MutableRefObject<number>,
  fieldPressedY: React.MutableRefObject<number>,
  numRows: number,
  numColumns: number,
  fieldArray: FieldType[][],
  fieldSize: number,
  cameraX: number,
  cameraY: number,
  cameraScale: number,
  viewMode: viewModes
) {
  let color = "black";

  if (viewMode === viewModes.SHORTEST_PATHING) {
    color = colors.pathColor;
  } else if (viewMode === viewModes.EXAMINATION) {
    color = colors.highlightColor;
  } else color = "black";

  if (leftIsPressed.current === false) {
    if (
      fieldPressedX.current >= 0 &&
      fieldPressedY.current >= 0 &&
      fieldPressedX.current < numColumns &&
      fieldPressedY.current < numRows
    ) {
      ctx!.fillStyle = color;
      // ctx!.globalCompositOperation = "source-over";
      ctx.globalAlpha = 0.5;

      ctx!.fillRect(
        fieldSize * 1 * fieldPressedX.current - cameraX,
        fieldSize * cameraScale * fieldPressedY.current - cameraY,
        fieldSize * cameraScale,
        fieldSize * cameraScale
      );
      ctx.globalAlpha = 1;
    }
  }
}
