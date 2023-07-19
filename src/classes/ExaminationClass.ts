import { MutableRefObject } from "react";
import FieldType from "../enums/FieldType";
import IndustrySegment from "./IndustrySegment";
import Position from "./Position";
import SegmentsContainer from "./SegmentsContainer";
import UrbanSegment from "./UrbanSegment";

class ExaminationClass {
  segmentsContainer: MutableRefObject<SegmentsContainer | null>;
  fieldArray: FieldType[][];
  positionPathToDrawRef: React.MutableRefObject<Position[]>;
  redraw: () => void;

  public constructor(
    fieldArray: FieldType[][],
    segmentsContainer: MutableRefObject<SegmentsContainer | null>,
    positionPathToDrawRef: React.MutableRefObject<Position[]>,
    redraw: () => void
  ) {
    this.fieldArray = fieldArray;
    this.segmentsContainer = segmentsContainer;
    this.positionPathToDrawRef = positionPathToDrawRef;
    this.redraw = redraw;
  }

  public showPath(x: number, y: number) {
    if (this.segmentsContainer.current) {
      let segment: UrbanSegment | IndustrySegment | null =
        this.segmentsContainer.current.getSegmentAt(x, y);
      if (segment) {
        if (segment instanceof UrbanSegment) {
          console.log("Segment is Urban");
          this.positionPathToDrawRef.current = segment.positionPathToIndustry;
        } else if (segment instanceof IndustrySegment) {
          console.log("Segment is industrial");
          if (segment.boundUrbanSegment != null) {
            this.positionPathToDrawRef.current =
              segment.boundUrbanSegment.positionPathToIndustry;
            this.redraw();
          }
        }
        console.log(
          "set the position path ref to " +
            JSON.stringify(this.positionPathToDrawRef.current)
        );
      } else {
        console.log("Segment is inull");
      }
    } else {
      console.log("Segments container is null");
    }
  }
}

export default ExaminationClass;
