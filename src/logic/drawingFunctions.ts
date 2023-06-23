import GraphNode from "../classes/GraphNode";
import colors from "../colors";
import FieldType from "../enums/FieldType";

export function drawGridOverlay(
  /// change that to use the alpha rather than line width
  ctx: CanvasRenderingContext2D,
  numRows: number,
  numColumns: number,
  fieldWidth: number,
  fieldHeight: number,
  cameraScale: number,
  cameraX: number,
  cameraY: number,
  canvasWidth: number,
  canvasHeight: number
) {
  console.log("drawing grid overlay");
  ctx!.strokeStyle = "#111111";
  for (let x1 = 0; x1 <= numRows; x1++) {
    ctx!.strokeStyle = "#111111";
    ctx.lineWidth = 0.01;

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
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}

export function drawNodeNumbers(
  ctx: CanvasRenderingContext2D,
  graphNodesRef: React.MutableRefObject<GraphNode[] | null | undefined>,
  fieldWidth: number,
  cameraScale: number
) {
  if (graphNodesRef.current) {
    for (let i = 0; i < graphNodesRef.current.length; i++) {
      let node: GraphNode = graphNodesRef.current[i];
      let color = "black";
      ctx!.fillStyle = color;
      ctx.fillText(
        i.toString(),
        node.x * fieldWidth * cameraScale + fieldWidth * cameraScale,
        node.y * fieldWidth * cameraScale,
        fieldWidth * cameraScale
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
  fieldWidth: number,
  fieldHeight: number,
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
        fieldWidth * 1 * x - cameraX,
        fieldHeight * cameraScale * y - cameraY,
        fieldWidth * cameraScale,
        fieldHeight * cameraScale
      );
    }
  }
}
