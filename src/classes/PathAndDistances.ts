import GraphNode from "./GraphNode";

class PathAndDistances {
  public dist: number = -1;
  public node: GraphNode | null = null;
  public predecessor: PathAndDistances | null = null;

  public constructor(
    dist: number,
    node: GraphNode | null,
    predecessor: PathAndDistances | null
  ) {
    this.dist = dist;
    this.node = node;
    this.predecessor = predecessor;
  }
}

export default PathAndDistances;
