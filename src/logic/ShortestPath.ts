import GraphNode from "../classes/GraphNode";
import PathAndDistances from "../classes/PathAndDistances";

class ShortestPath {
  public n = 0;

  public minDistance(dist: number[], sptSet: boolean[]): number {
    let min = Number.MAX_VALUE;
    let min_index = -1;

    for (let v = 0; v < this.n; v++) {
      if (!sptSet[v] && dist[v] <= min) {
        min = dist[v];
        min_index = v;
      }
    }
    return min_index;
  }

  public dijkstra(graphNodes: GraphNode[], src: number): PathAndDistances[] {
    this.n = graphNodes.length;
    const pad: PathAndDistances[] = new Array(this.n);
    const dist: number[] = new Array(this.n);
    const sptSet: boolean[] = new Array(this.n);

    for (let i = 0; i < this.n; i++) {
      dist[i] = Number.MAX_VALUE;
      sptSet[i] = false;
      pad[i] = new PathAndDistances(0, null, null);
    }

    dist[src] = 0;

    for (let count = 0; count < this.n - 1; count++) {
      const u = this.minDistance(dist, sptSet);
      sptSet[u] = true;

      for (let v = 0; v < this.n; v++) {
        let thereIsAnEdgeFromUToV = -1;
        let distance = Number.MAX_VALUE;
        for (let k = 0; k < graphNodes[u].neighbours.length; k++) {
          const node = graphNodes[u].neighbours[k];
          if (
            node &&
            node.x === graphNodes[v].x &&
            node.y === graphNodes[v].y
          ) {
            thereIsAnEdgeFromUToV = k;
            distance = graphNodes[u].getDistance(k);
          }
        }

        if (
          !sptSet[v] &&
          thereIsAnEdgeFromUToV > -1 &&
          dist[u] !== Number.MAX_VALUE &&
          dist[u] + distance < dist[v]
        ) {
          dist[v] = dist[u] + distance;
          pad[v].dist = dist[v];
          pad[v].node = graphNodes[v];
          pad[v].predecessor = pad[u];
        }
      }
    }

    return pad;
  }
}
export default ShortestPath;
