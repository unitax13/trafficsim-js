class GraphNode {
  public x: number;
  public y: number;
  public neighbours: GraphNode[] | null[] = new Array(4);
  public distances: number[] = new Array(4);
  public passengers: number[] = new Array(4);
  public capacities: number[] = new Array(4);

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.neighbours = new Array(4);
  }

  public getDistance(i: number): number {
    return this.distances[i];
  }
}

export default GraphNode;
