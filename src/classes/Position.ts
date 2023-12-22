class Position {
  public x: number = 0;
  public y: number = 0;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toString() {
    return `[${this.x}, ${this.y}]`;
  }
}

export default Position;
