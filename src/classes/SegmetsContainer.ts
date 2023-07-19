import FieldType from "../enums/FieldType";
import GraphNode from "./GraphNode";
import IndustrySegment from "./IndustrySegment";
import UrbanSegment from "./UrbanSegment";

class SegmentsContainer {
  fieldArray: FieldType[][];

  graphNodes: GraphNode[] | null | undefined;

  public urbanSegments: UrbanSegment[] = new Array<UrbanSegment>();
  public industrySegments: IndustrySegment[] = new Array<IndustrySegment>();

  public constructor(
    fieldArray: FieldType[][],
    graphNodes: GraphNode[] | null | undefined
  ) {
    this.fieldArray = fieldArray;
    this.graphNodes = graphNodes;

    for (let i = 0; i < this.fieldArray.length; i++) {
      for (let j = 0; j < this.fieldArray[i].length; j++) {
        if (this.fieldArray[i][j] === FieldType.Urban) {
          this.urbanSegments.push(new UrbanSegment(i, j));
        } else if (this.fieldArray[i][j] === FieldType.Industrial) {
          this.industrySegments.push(new IndustrySegment(i, j));
        }
      }
    }
  }

  public bindRandomly(onlyNotBoundYet: boolean) {
    let ises = this.industrySegments.slice();
    for (let i = 0; i < this.urbanSegments.length; i++) {
      if (
        onlyNotBoundYet &&
        this.urbanSegments[i].boundIndustrySegment === null
      ) {
        continue;
      }
      let pickedOne = Math.floor(Math.random() * ises.length);

      let us: UrbanSegment = this.urbanSegments[i];
      let is = ises[pickedOne];

      us.boundIndustrySegment = is;
      is.boundUrbanSegment = us;

      ises.splice(pickedOne, 1);
    }
  }
}

export default SegmentsContainer;
