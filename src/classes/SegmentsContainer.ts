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

  public printUrbanSegments(): void {
    this.urbanSegments.forEach((element) => {
      console.log(
        "Urban segment at " +
          element.position.x +
          ";" +
          element.position.y +
          " bound to industrial segment at " +
          element.boundIndustrySegment?.position.x +
          ";" +
          element.boundIndustrySegment?.position.y
      );
    });
  }

  public printIndustrySegments(): void {
    this.industrySegments.forEach((element) => {
      console.log(
        "Industry segment at " +
          element.position.x +
          ";" +
          element.position.y +
          " bound to industrial segment at " +
          element.boundUrbanSegment?.position.x +
          ";" +
          element.boundUrbanSegment?.position.y
      );
    });
  }

  public bindRandomly(onlyNotBoundYet: boolean) {
    let ises = this.industrySegments.slice();
    // make a vector of randomly ordered urban segments ids to iterate over them later
    let randomlyOrderedUrbanSegmentsIds = generateNumbers(
      this.urbanSegments.length
    ).sort(() => Math.random() - 0.5);

    // console.log(randomlyOrderedUrbanSegmentsIds);

    for (
      let i = 0;
      i < Math.min(this.urbanSegments.length, this.industrySegments.length);
      i++
    ) {
      if (
        onlyNotBoundYet &&
        this.urbanSegments[randomlyOrderedUrbanSegmentsIds[i]]
          .boundIndustrySegment === null
      ) {
        continue;
      }
      let pickedOne = Math.floor(Math.random() * ises.length);

      let us: UrbanSegment =
        this.urbanSegments[randomlyOrderedUrbanSegmentsIds[i]];
      let is = ises[pickedOne];

      us.boundIndustrySegment = is;
      is.boundUrbanSegment = us;

      ises.splice(pickedOne, 1);
    }
  }

  public getSegmentAt(
    x: number,
    y: number
  ): UrbanSegment | IndustrySegment | null {
    let segment: UrbanSegment | IndustrySegment | null = null;

    for (const us_element of this.urbanSegments) {
      if (us_element.position.x === x && us_element.position.y === y) {
        segment = us_element;
        break;
      }
    }

    for (const is_element of this.industrySegments) {
      if (is_element.position.x === x && is_element.position.y === y) {
        segment = is_element;
        break;
      }
    }

    return segment;
  }
}

function generateNumbers(limit: number): number[] {
  const numbers: number[] = [];
  for (let i = 0; i < limit; i++) {
    numbers.push(i);
  }
  return numbers;
}

export default SegmentsContainer;
