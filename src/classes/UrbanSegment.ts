import ShortestPath from "../logic/ShortestPath";
import getNodeAt from "../utils/getNodeAt";
import getNodeIndex from "../utils/getNodeIndex";
import GraphNode from "./GraphNode";
import IndustrySegment from "./IndustrySegment";
import PathAndDistances from "./PathAndDistances";
import Position from "./Position";
import Segment from "./Segment";

class UrbanSegment extends Segment {
  public boundIndustrySegment: IndustrySegment | null = null;
  public positionPathToIndustry: Position[] = [];
  public nodePathToIndustry: GraphNode[] = [];
  public distanceToIndustry: number = 0;
  public outAlready: boolean = false;

  public totalStepsTravellingTook: number = 0;
  public totalTimeTravellingTook: number = 0;

  public findPathToBoundSegment(
    graphNodes: GraphNode[],
    startId: number,
    doUpdateSegment: boolean
  ): void {
    //define arrays
    let destinationIds: number[] = [];
    let distances: number[] = [];
    let positionPathsToIndustry: Array<Array<Position>> = [];
    let nodePaths: Array<Array<GraphNode>> = [];

    let stardIds: number[] = [];
    //we can choose whether to have a starting node id
    if (startId > -1) {
      stardIds.push(startId);
    }
    //but if there is none, then take the closest nodes of the urban segment and add the them as startIds

    if (this.closestRoadNodes && this.boundIndustrySegment) {
      if (stardIds.length == 0) {
        let closestNodesDoExist: boolean = false;
        if (this.closestRoadNodes[0]) {
          closestNodesDoExist = true;
          stardIds.push(
            getNodeIndex(
              this.closestRoadNodes[0].x,
              this.closestRoadNodes[0].y,
              graphNodes
            )
          );
        }
        if (this.closestRoadNodes[1]) {
          closestNodesDoExist = true;
          stardIds.push(
            getNodeIndex(
              this.closestRoadNodes[1].x,
              this.closestRoadNodes[1].y,
              graphNodes
            )
          );
        }
        !closestNodesDoExist
          ? console.log("no closest road nodes found at start")
          : undefined;
      }

      //console.log("StartIDs:" + stardIds);

      //take the closest nodes of the industry segment and add them as destinationIds
      let closestNodesDoExist: boolean = false;
      if (this.boundIndustrySegment.closestRoadNodes[0]) {
        closestNodesDoExist = true;
        destinationIds.push(
          getNodeIndex(
            this.boundIndustrySegment.closestRoadNodes[0].x,
            this.boundIndustrySegment.closestRoadNodes[0].y,
            graphNodes
          )
        );
      }
      if (this.boundIndustrySegment.closestRoadNodes[1]) {
        closestNodesDoExist = true;
        destinationIds.push(
          getNodeIndex(
            this.boundIndustrySegment.closestRoadNodes[1].x,
            this.boundIndustrySegment.closestRoadNodes[1].y,
            graphNodes
          )
        );
      }
      !closestNodesDoExist
        ? console.log("no closest road nodes found at destination")
        : undefined;

      console.log("destination ids:" + destinationIds);

      for (let a = 0; a < stardIds.length; a++) {
        let path1 = new ShortestPath();
        let pathAndDistancesArray = new Array<PathAndDistances>();

        pathAndDistancesArray = path1.dijkstra(graphNodes, stardIds[a]);

        for (let i = 0; i < pathAndDistancesArray.length; i++) {
          if (
            (destinationIds.length >= 1 && i === destinationIds[0]) ||
            (destinationIds.length >= 2 && i === destinationIds[1])
          ) {
            pathAndDistancesArray[i].dist +=
              this.distancesToClosestRoadNodes[a];

            //add distance from the bound industry segment's closest road segment to its closest road node

            pathAndDistancesArray[i].dist +=
              this.boundIndustrySegment.getDistanceToClosestRoadNodesByNodeId(
                i,
                graphNodes
              );

            distances.push(pathAndDistancesArray[i].dist);

            let pad2: PathAndDistances | null =
              pathAndDistancesArray[i].predecessor;

            let nodePath: Array<GraphNode> = new Array<GraphNode>();
            let singlePositionPath: Array<Position> = new Array<Position>();

            if (this.boundIndustrySegment.closestRoadSegmentPosition) {
              singlePositionPath.push(
                this.boundIndustrySegment.closestRoadSegmentPosition
              );
            }
            if (pathAndDistancesArray[i].node != null) {
              singlePositionPath.push(
                new Position(
                  pathAndDistancesArray[i].node!.x,
                  pathAndDistancesArray[i].node!.y
                )
              );
              nodePath.push(pathAndDistancesArray[i].node!);
            }

            while (pad2) {
              if (pad2.node) {
                nodePath.push(pad2.node);
                singlePositionPath.push(new Position(pad2.node.x, pad2.node.y));
              }
              pad2 = pad2.predecessor;
            }

            nodePath.push(graphNodes[stardIds[a]]);
            nodePaths.push(nodePath);

            singlePositionPath.push(
              new Position(graphNodes[stardIds[a]].x, graphNodes[stardIds[a]].y)
            );
            if (this.closestRoadSegmentPosition) {
              singlePositionPath.push(this.closestRoadSegmentPosition);
            }

            positionPathsToIndustry.push(singlePositionPath);
          }
        }
      }
      let minDistance = distances[0];
      let whichOne = 0;

      for (let i = 1; i < distances.length; i++) {
        if (minDistance > distances[i]) {
          minDistance = distances[i];
          whichOne = i;
        }
      }

      if (doUpdateSegment) {
        this.positionPathToIndustry = positionPathsToIndustry[whichOne];
        this.nodePathToIndustry = nodePaths[whichOne];
        this.distanceToIndustry = minDistance;
      }
      console.log(positionPathsToIndustry[whichOne]);
    }
  }
}

export default UrbanSegment;
