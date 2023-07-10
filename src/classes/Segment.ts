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
      pos = this.crossSearchAtRange(
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

  private spiralSearchAtRange(
    matrix: FieldType[][],
    targetType: FieldType,
    startX: number,
    startY: number,
    radius: number
  ): Position | null {
    const directions = [
      [1, 0], // Right
      [1, 1], // Diagonal down-right
      [0, 1], // Down
      [-1, 1], // Diagonal down-left
      [-1, 0], // Left
      [-1, -1], // Diagonal up-left
      [0, -1], // Up
      [1, -1], // Diagonal up-right
    ];

    let x = startX;
    let y = startY;
    let step = 1;
    let stepsCount = 0;
    let directionIndex = 0;

    console.log("okay so starting with position ", startX, startY);

    while (step <= radius) {
      for (let i = 0; i < step; i++) {
        console.log("Checkiong position ", x, ",", y);
        if (
          x >= 0 &&
          x < matrix.length &&
          y >= 0 &&
          y < matrix[0].length &&
          matrix[x][y] === targetType
        ) {
          console.log("FOUND IT");
          return new Position(x, y);
        }

        x += directions[directionIndex][0];
        y += directions[directionIndex][1];
        // console.log(
        //   "now position is " +
        //     x +
        //     ", " +
        //     y +
        //     " with directions " +
        //     directions[directionIndex]
        // );
        stepsCount++;

        if (stepsCount === matrix.length * matrix[0].length) {
          // The search has covered the entire matrix without finding the target value
          console.log(
            "The search has covered the entire matrix without finding the target value"
          );
          return null;
        }
      }

      directionIndex = (directionIndex + 1) % 8; // Move to the next direction
      if (directionIndex % 2 === 0) {
        // Increase the step size every two directions
        step++;
      }
    }
    console.log("The target value was not found within the specified radius");
    return null; // The target value was not found within the specified radius
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
    if (fieldArray[presentX][presentY] === type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.closestRoadSegmentPosition = new Position(presentX, presentY);
      return this.closestRoadSegmentPosition;
    }
    //RIGHT
    presentX = startX + range;
    presentY = startY;
    if (fieldArray[presentX][presentY] === type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.closestRoadSegmentPosition = new Position(presentX, presentY);
      return this.closestRoadSegmentPosition;
    }

    //DOWN
    presentX = startX;
    presentY = startY + range;
    if (fieldArray[presentX][presentY] === type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.closestRoadSegmentPosition = new Position(presentX, presentY);
      return this.closestRoadSegmentPosition;
    }

    //LEFT
    presentX = startX - range;
    presentY = startY;
    if (fieldArray[presentX][presentY] === type) {
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
}

export default Segment;
