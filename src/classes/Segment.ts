import FieldType from "../enums/FieldType";
import getNodeAt from "../utils/getNodeAt";
import getNodeIndex from "../utils/getNodeIndex";
import GraphNode from "./GraphNode";
import Position from "./Position";

class Segment {
  public position: Position;
  public closestRoadSegmentPosition: Position | null = null;

  public closestRoadSegmentIsNode: boolean = false;

  public closestRoadNodesPositions: Position[] = [];
  public closestRoadNodes: GraphNode[] = [];
  public distancesToClosestRoadNodes: number[] = [];

  public constructor(x: number, y: number) {
    this.position = new Position(x, y);
  }

  public calculateClosestRoadSegment(
    fieldArray: FieldType[][],
    radius: number
  ): void {
    let startX = this.position.x;
    let startY = this.position.y;

    let pos: Position | null = null;

    for (let i = 1; i < radius; i++) {
      // pos = this.crossSearchAtRange(
      //   fieldArray,
      //   FieldType.Road1,
      //   startX,
      //   startY,
      //   i
      // );
      // if (pos) {
      //   this.closestRoadSegmentPosition = pos;
      //   return;
      // }

      pos = this.spiralSearchAtRange(
        fieldArray,
        FieldType.Road1,
        startX,
        startY,
        i
      );
      if (pos) {
        this.closestRoadSegmentPosition = pos;
        return;
      }
    }
    this.closestRoadSegmentPosition = null;
    return;
  }

  private isInBounds(x: number, y: number, matrix: FieldType[][]): boolean {
    return x >= 0 && y >= 0 && x < matrix.length && y < matrix[0].length;
  }

  private spiralSearchAtRange(
    matrix: FieldType[][],
    targetType: FieldType,
    startX: number,
    startY: number,
    radius: number
  ): Position | null {
    let j = 1;
    for (let i = 1; i <= radius; i++) {
      //start with the top, so
      let y = startY - i;
      let x = startX;

      // move left
      while (x >= startX - i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        x -= 1;
      }
      x = startX;

      // move right
      while (x <= startX + i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        x += 1;
      }

      // start with the right, then go up and down
      y = startY;
      x = startX + i;

      // move up
      while (y >= startY - i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        y -= 1;
      }

      //now move down
      y = startY;

      while (y <= startY + i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        y += 1;
      }

      //start with down, then go right and left
      y = startY + i;
      x = startX;
      // move right
      while (x <= startX + i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        x += 1;
      }
      //now move left
      x = startX;
      while (x >= startX - i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        x -= 1;
      }

      //start with left, then go down and up
      x = startX - i;
      y = startY;
      //move down
      while (y <= startY + i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        y += 1;
      }
      y = startY;
      // now move up
      while (y >= startY - i) {
        if (this.isInBounds(x, y, matrix)) {
          if (matrix[x][y] === targetType) {
            console.log("found at ", x, ";", y);
            return new Position(x, y);
          }
        }
        y -= 1;
      }
    }

    console.log("The target value was not found within the specified radius");
    return null;
  }

  private crossSearchAtRange(
    fieldArray: FieldType[][],
    type: FieldType,
    startX: number,
    startY: number,
    range: number
  ) {
    //UP
    let presentX = startX;
    let presentY = startY - range;
    if (presentY >= 0 && fieldArray[presentX][presentY] === type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.closestRoadSegmentPosition = new Position(presentX, presentY);
      return this.closestRoadSegmentPosition;
    }
    //RIGHT
    presentX = startX + range;
    presentY = startY;
    if (
      presentX < fieldArray.length &&
      fieldArray[presentX][presentY] === type
    ) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.closestRoadSegmentPosition = new Position(presentX, presentY);
      return this.closestRoadSegmentPosition;
    }

    //DOWN
    presentX = startX;
    presentY = startY + range;
    if (
      presentY < fieldArray[0].length &&
      fieldArray[presentX][presentY] === type
    ) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.closestRoadSegmentPosition = new Position(presentX, presentY);
      return this.closestRoadSegmentPosition;
    }

    //LEFT
    presentX = startX - range;
    presentY = startY;
    if (presentX >= 0 && fieldArray[presentX][presentY] === type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.closestRoadSegmentPosition = new Position(presentX, presentY);
      return this.closestRoadSegmentPosition;
    }

    return null;
  }

  public findClosestRoadNodes(
    fieldArray: FieldType[][],
    graphNodes: GraphNode[]
  ): void {
    this.closestRoadNodes = new Array();
    this.closestRoadNodesPositions = new Array();

    if (this.closestRoadSegmentPosition != null) {
      let x = this.closestRoadSegmentPosition.x;
      let y = this.closestRoadSegmentPosition.y;

      //  if it's a node, set it as closest road node and return
      let gn: GraphNode | null = getNodeAt(x, y, graphNodes);

      if (gn) {
        this.closestRoadSegmentIsNode = true;
        this.closestRoadNodesPositions.push(new Position(gn.x, gn.y));
        this.distancesToClosestRoadNodes.push(0);
        this.closestRoadNodes.push(gn);
        return;
      }

      //if it's not the node
      // if there exist road segments horizontally on both left and right (otherwise it's a node), then go left and right incrementally until you hit the node

      if (
        fieldArray[x - 1][y] == FieldType.Road1 &&
        fieldArray[x + 1][y] == FieldType.Road1
      ) {
        //W PRAWO
        for (let i = x; fieldArray[i][y] == FieldType.Road1; i++) {
          let gn: GraphNode | null = getNodeAt(i, y, graphNodes);
          if (gn) {
            this.closestRoadNodesPositions.push(new Position(i, y));
            this.closestRoadNodes.push(gn);
            this.distancesToClosestRoadNodes.push(Math.abs(i - x));
            break;
          }
        }
        //W LEWO
        for (let i = x; fieldArray[i][y] == FieldType.Road1; i--) {
          let gn: GraphNode | null = getNodeAt(i, y, graphNodes);
          if (gn) {
            this.closestRoadNodesPositions.push(new Position(i, y));
            this.closestRoadNodes.push(gn);
            this.distancesToClosestRoadNodes.push(Math.abs(i - x));
            break;
          }
        }
      }

      if (
        fieldArray[x][y - 1] == FieldType.Road1 &&
        fieldArray[x][y + 1] == FieldType.Road1
      ) {
        // W GÓRĘ
        for (let i = y; fieldArray[x][i] == FieldType.Road1; i++) {
          let gn: GraphNode | null = getNodeAt(x, i, graphNodes);
          if (gn) {
            this.closestRoadNodesPositions.push(new Position(x, i));
            this.closestRoadNodes.push(gn);
            this.distancesToClosestRoadNodes.push(Math.abs(i - y));
            break;
          }
        }
        //W DÓł
        for (let i = y; fieldArray[x][i] == FieldType.Road1; i--) {
          let gn: GraphNode | null = getNodeAt(x, i, graphNodes);
          if (gn) {
            this.closestRoadNodesPositions.push(new Position(x, i));
            this.closestRoadNodes.push(gn);
            this.distancesToClosestRoadNodes.push(Math.abs(i - y));
            break;
          }
        }
      }
    } else {
      console.log("Closest road segment is null.");
    }
  }

  public getDistanceToClosestRoadNodesByNodeId(
    nodeId: number,
    graphNodes: GraphNode[]
  ): number {
    for (let i = 0; i < this.closestRoadNodes.length; i++) {
      if (
        nodeId ===
        getNodeIndex(
          this.closestRoadNodesPositions[i].x,
          this.closestRoadNodesPositions[i].y,
          graphNodes
        )
      ) {
        return this.distancesToClosestRoadNodes[i];
      }
    }

    console.log(
      "Did not find any ClosestRoadNodesByNodeId nodes matching id ",
      nodeId
    );
    return -1;
  }

  public printSegmentStats(): void {
    console.log({
      segmentAt: "[" + this.position.x + "," + this.position.y + "]",
      nearestRoadSegment:
        "[" +
        this.closestRoadSegmentPosition?.x +
        "," +
        this.closestRoadSegmentPosition?.y +
        "]",
      isANode: this.closestRoadSegmentIsNode,
      closestRoadNodesPositions: this.closestRoadNodesPositions.toString(),
    });
  }

  public printSegmentStats2(): void {
    console.log(`Segment at [${this.position.x}, ${this.position.y}].`);
    if (this.closestRoadSegmentPosition !== null) {
      console.log(
        `Closest road segment is at [${this.closestRoadSegmentPosition.x}, ${this.closestRoadSegmentPosition.y}] `
      );

      if (this.closestRoadSegmentIsNode) {
        console.log("and IS a node.\n");
      } else {
        console.log("and IS NOT a node.\n");
      }
    } else {
      console.log("No closest road segment\n");
    }

    const n = this.closestRoadNodes.length;
    if (n > 0) {
      console.log(`Closest road nodes (${n}):`);
    }

    for (let i = 0; i < n; i++) {
      console.log(
        `[${this.closestRoadNodes[i].x}, ${this.closestRoadNodes[i].y}] and ${this.distancesToClosestRoadNodes[i]} from closest road segment\n`
      );
    }
  }
}

export default Segment;
