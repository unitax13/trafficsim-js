class GraphNode {
  public x: number;
  public y: number;
  public neighbours: GraphNode[] | null = [];
  public distances: number[] = [0, 0, 0, 0];
  public passengers: number[] = [0, 0, 0, 0];
  public capacities: number[] = [0, 0, 0, 0];

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
