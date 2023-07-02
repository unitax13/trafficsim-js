import FieldType from "../enums/FieldType";

class Segment {
  public position: Position;
  public nearestRoadSegmentPosition: Position | null = null;

  public closestRoadSegmentIsNode: boolean = false;
  public closestRoadNodes: Position[] = [];
  public distancesToClosestRoadNodes: number[] = [];

  public constructor(x: number, y: number) {
    this.position = new Position(x, y);
  }

  public calculateClosestRoadSegment(
    fieldArray: FieldType[][],
    radius: number
  ): Position | null {
    let startX = this.position.x;
    let startY = this.position.y;

    let pos: Position | null;

    for (let i = 1; i < radius; i++) {
      pos = this.crossSearchAtRange(
        fieldArray,
        FieldType.Road1,
        startX,
        startY,
        i
      );
      if (pos !== null) {
        return pos;
      }

      pos = this.spiralSearchAtRange(
        fieldArray,
        FieldType.Road1,
        startX,
        startY,
        i
      );
      if (pos !== null) {
        return pos;
      }
    }

    return null;
  }

  public printSegmentStats(): void {
    console.log({
      segmentAt: "[" + this.position.x + "," + this.position.y + "]",
      nearestRoadSegment:
        "[" +
        this.nearestRoadSegmentPosition?.x +
        "," +
        this.nearestRoadSegmentPosition?.y +
        "]",
      isANode: this.closestRoadSegmentIsNode,
      closestRoadNodes: this.closestRoadNodes.toString(),
    });
  }

  private spiralSearchAtRange(
    matrix: FieldType[][],
    targetType: number,
    startX: number,
    startY: number,
    radius: number
  ): Position | null {
    const directions = [
      [-1, 1], // Diagonal up-right
      [0, 1], // Right
      [1, 1], // Diagonal down-right
      [1, 0], // Down
      [1, -1], // Diagonal down-left
      [0, -1], // Left
      [-1, -1], // Diagonal up-left
      [-1, 0], // Up
    ];

    let x = startX;
    let y = startY;
    let step = 1;
    let stepsCount = 0;
    let directionIndex = 0;

    while (step <= radius) {
      for (let i = 0; i < step; i++) {
        if (
          x >= 0 &&
          x < matrix.length &&
          y >= 0 &&
          y < matrix[0].length &&
          matrix[x][y] === targetType
        ) {
          return new Position(x, y);
        }

        x += directions[directionIndex][0];
        y += directions[directionIndex][1];
        stepsCount++;

        if (stepsCount === matrix.length * matrix[0].length) {
          // The search has covered the entire matrix without finding the target value
          return null;
        }
      }

      directionIndex = (directionIndex + 1) % 8; // Move to the next direction
      if (directionIndex % 2 === 0) {
        // Increase the step size every two directions
        step++;
      }
    }

    return null; // The target value was not found within the specified radius
  }

  private crossSearchAtRange(
    fieldArray: FieldType[][],
    type: FieldType,
    startX: number,
    startY: number,
    range: number
  ) {
    let presentX = startX;
    let presentY = startY + range;
    //UP
    if (fieldArray[presentX][presentY] == type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.nearestRoadSegmentPosition = new Position(presentX, presentY);
      return this.nearestRoadSegmentPosition;
    }
    //RIGHT
    presentX = startX + range;
    presentY = startY;
    if (fieldArray[presentX][presentY] == type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.nearestRoadSegmentPosition = new Position(presentX, presentY);
      return this.nearestRoadSegmentPosition;
    }

    //DOWN
    presentX = startX;
    presentY = startY - range;
    if (fieldArray[presentX][presentY] == type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.nearestRoadSegmentPosition = new Position(presentX, presentY);
      return this.nearestRoadSegmentPosition;
    }

    //LEFT
    presentX = startX - range;
    presentY = startY;
    if (fieldArray[presentX][presentY] == type) {
      //System.out.println("Found road segment at [" + presentX + "," + presentY + "].");
      this.nearestRoadSegmentPosition = new Position(presentX, presentY);
      return this.nearestRoadSegmentPosition;
    }

    return null;
  }
}

export default Segment;
