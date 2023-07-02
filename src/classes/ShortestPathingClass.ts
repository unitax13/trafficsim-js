import FieldType from "../enums/FieldType";
import GraphNode from "./GraphNode";
import IndustrySegment from "./IndustrySegment";
import UrbanSegment from "./UrbanSegment";

class ShortestPathingClass {
  public segment1: UrbanSegment;
  public segment2: IndustrySegment;

  positionArrayList: Position[];

  fieldArray: FieldType[][];
  graphNodes: GraphNode[];

  public constructor(fieldArray: FieldType[][], graphNodes: GraphNode[]) {
    this.fieldArray = fieldArray;
    this.graphNodes = graphNodes;
    this.positionArrayList = new Array<Position>();
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

      // us.calculateClosestRoadSegment(simulation, 10);
      // us.findClosestRoadNodes(simulation, graphNodes);
      // is.calculateClosestRoadSegment(simulation, 10);
      // is.findClosestRoadNodes(simulation, graphNodes);

      // us.findPathToCorrespondingSegment(graphNodes, -1, true);

      // simulationGrid.positionPath = us.pathToIndustry;
      // simulationGrid.positionPathToDrawIsOn = true;
    }
  }
}

export default ShortestPathingClass;
