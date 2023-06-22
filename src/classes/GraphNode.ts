class GraphNode {
  public x: number;
  public y: number;
  public neighbours: GraphNode[] | null = new Array(4);
  public distances: number[] | null = new Array(4);
  public passengers: number[] | null = new Array(4);
  public capacities: number[] | null = new Array(4);

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.neighbours = new Array(4);
  }
}

export default GraphNode;
