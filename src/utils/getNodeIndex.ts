import GraphNode from "../classes/GraphNode";

function getNodeIndex(x: number, y: number, graphNodes: GraphNode[]): number {
  let indexToReturn: number = -1;

  graphNodes.every((gn, index) => {
    if (gn.x == x && gn.y == y) {
      indexToReturn = index;
      return false;
    }
    return true;
  });
  return indexToReturn;
}

export default getNodeIndex;
