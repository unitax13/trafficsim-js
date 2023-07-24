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
  highlightedSegmentPositions: React.MutableRefObject<Position[] | null>;
  distanceToTargetRef: React.MutableRefObject<number>;
  redraw: () => void;

  public constructor(
    fieldArray: FieldType[][],
    segmentsContainer: MutableRefObject<SegmentsContainer | null>,
    positionPathToDrawRef: React.MutableRefObject<Position[]>,
    highlightedSegmentPositions: React.MutableRefObject<Position[] | null>,
    distanceToTargetRef: React.MutableRefObject<number>,
    redraw: () => void
  ) {
    this.fieldArray = fieldArray;
    this.segmentsContainer = segmentsContainer;
    this.positionPathToDrawRef = positionPathToDrawRef;
    this.highlightedSegmentPositions = highlightedSegmentPositions;
    this.distanceToTargetRef = distanceToTargetRef;

    this.redraw = redraw;
  }

  public showPath(x: number, y: number) {
    if (this.segmentsContainer.current) {
      let segment: UrbanSegment | IndustrySegment | null =
        this.segmentsContainer.current.getSegmentAt(x, y);
      if (segment) {
        this.highlightedSegmentPositions.current = new Array<Position>();
        this.highlightedSegmentPositions.current?.push(segment.position);
        if (segment instanceof UrbanSegment) {
          console.log("Segment is Urban");
          this.positionPathToDrawRef.current = segment.positionPathToIndustry;
          this.distanceToTargetRef.current = segment.distanceToIndustry;

          if (segment.boundIndustrySegment) {
            this.highlightedSegmentPositions.current?.push(
              segment.boundIndustrySegment.position
            );
          } else {
            // this.highlightedSegmentPositions.current.push(null);
          }
        } else if (segment instanceof IndustrySegment) {
          console.log("Segment is industrial");
          if (segment.boundUrbanSegment !== null) {
            this.positionPathToDrawRef.current =
              segment.boundUrbanSegment.positionPathToIndustry;

            this.highlightedSegmentPositions.current.push(
              segment.boundUrbanSegment.position
            );
            this.distanceToTargetRef.current =
              segment.boundUrbanSegment.distanceToIndustry;
          } else {
            //this.highlightedSegmentPosition.current = null;
          }
        }
        this.redraw();
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
