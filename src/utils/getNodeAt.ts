import GraphNode from "../classes/GraphNode";

function getNodeAt(
  x: number,
  y: number,
  graphNodes: GraphNode[]
): GraphNode | null {
  let node: GraphNode | null = null;

  graphNodes.every((gn) => {
    if (gn.x == x && gn.y == y) {
      node = gn;
      return false;
    }
    return true;
  });
  return node;
}

export default getNodeAt;
