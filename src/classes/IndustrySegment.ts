import Position from "./Position";
import Segment from "./Segment";
import UrbanSegment from "./UrbanSegment";

class IndustrySegment extends Segment {
  public boundUrbanSegment: UrbanSegment | null = null;
  public pathToUrban: Position[] | null = null;
}

export default IndustrySegment;
