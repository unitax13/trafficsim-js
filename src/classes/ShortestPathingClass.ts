import FieldType from "../enums/FieldType";
import GraphNode from "./GraphNode";
import IndustrySegment from "./IndustrySegment";
import Position from "./Position";
import UrbanSegment from "./UrbanSegment";

class ShortestPathingClass {
  positionArrayList: Position[];
  fieldArray: FieldType[][];
  graphNodes: GraphNode[];
  positionPathToDrawRef: React.MutableRefObject<Position[]>;

  public constructor(
    fieldArray: FieldType[][],
    graphNodes: GraphNode[],
    positionPathToDrawRef: React.MutableRefObject<Position[]>
  ) {
    this.fieldArray = fieldArray;
    this.graphNodes = graphNodes;
    this.positionArrayList = new Array<Position>();
    this.positionPathToDrawRef = positionPathToDrawRef;
  }

  public add(position: Position) {
    if (this.positionArrayList.length <= 1) {
      this.positionArrayList.push(position);
    } else if (this.positionArrayList.length == 2) {
      this.positionArrayList.shift();
      this.positionArrayList.push(position);
    }

    if (this.positionArrayList.length == 2) {
      this.apply();
    }
  }

  public apply() {
    if (this.positionArrayList.length == 2) {
      let us: UrbanSegment = new UrbanSegment(
        this.positionArrayList[0].x,
        this.positionArrayList[0].y
      );
      let is: IndustrySegment = new IndustrySegment(
        this.positionArrayList[1].x,
        this.positionArrayList[1].y
      );
      us.boundIndustrySegment = is;

      us.calculateClosestRoadSegment(this.fieldArray, 10);
      us.findClosestRoadNodes(this.fieldArray, this.graphNodes);
      is.calculateClosestRoadSegment(this.fieldArray, 10);
      is.findClosestRoadNodes(this.fieldArray, this.graphNodes);

      console.log(
        "Closest road nodes of us: ",
        us.closestRoadNodesPositions,
        " with distances: ",
        us.distancesToClosestRoadNodes
      );
      console.log(
        "Closest road nodes of is: ",
        is.closestRoadNodesPositions,
        " with distances: ",
        is.distancesToClosestRoadNodes
      );

      us.findPathToBoundSegment(this.graphNodes, -1, true);

      this.positionPathToDrawRef.current = us.positionPathToIndustry;

      let string = "Path = ";
      us.positionPathToIndustry.forEach((position) => {
        console.log(position);
        //string += position + " --> ";
      });

      console.log(string);

      // simulationGrid.positionPath = us.pathToIndustry;
      // simulationGrid.positionPathToDrawIsOn = true;
    }
  }
}

export default ShortestPathingClass;
