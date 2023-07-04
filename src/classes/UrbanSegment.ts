import GraphNode from "./GraphNode";
import IndustrySegment from "./IndustrySegment";
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
}

export default UrbanSegment;
