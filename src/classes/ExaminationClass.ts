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
  messagesRef: React.MutableRefObject<string[]>;
  redraw: () => void;

  public constructor(
    fieldArray: FieldType[][],
    segmentsContainer: MutableRefObject<SegmentsContainer | null>,
    positionPathToDrawRef: React.MutableRefObject<Position[]>,
    highlightedSegmentPositions: React.MutableRefObject<Position[] | null>,
    distanceToTargetRef: React.MutableRefObject<number>,
    messagesRef: React.MutableRefObject<string[]>,
    redraw: () => void
  ) {
    this.fieldArray = fieldArray;
    this.segmentsContainer = segmentsContainer;
    this.positionPathToDrawRef = positionPathToDrawRef;
    this.highlightedSegmentPositions = highlightedSegmentPositions;
    this.distanceToTargetRef = distanceToTargetRef;
    this.messagesRef = messagesRef;

    this.redraw = redraw;
  }

  public examineField(x: number, y: number): void {
    if (this.segmentsContainer.current) {
      this.messagesRef.current = [];
      let segment: UrbanSegment | IndustrySegment | null =
        this.segmentsContainer.current.getSegmentAt(x, y);
      if (
        segment &&
        (segment instanceof UrbanSegment || segment instanceof IndustrySegment)
      ) {
        this.showPath(x, y);
      } else {
        //check the field array, to check if that's a road or empty
        if (this.fieldArray[x][y] === FieldType.Road1) {
          this.messagesRef.current.push("Road segment.");
        } else if (this.fieldArray[x][y] === FieldType.Empty) {
          this.messagesRef.current.push("Empty field.");
        }
      }
    }
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
          this.messagesRef.current.push("Selected segment is urban.");
          this.positionPathToDrawRef.current = segment.positionPathToIndustry;
          this.distanceToTargetRef.current = segment.distanceToIndustry;

          if (segment.boundIndustrySegment) {
            this.highlightedSegmentPositions.current?.push(
              segment.boundIndustrySegment.position
            );
            this.messagesRef.current.push(
              "Bound to industry segment at [" +
                segment.boundIndustrySegment.position.x +
                ";" +
                segment.boundIndustrySegment.position.y +
                "]."
            );
          } else {
            // this.highlightedSegmentPositions.current.push(null);
          }
        } else if (segment instanceof IndustrySegment) {
          console.log("Segment is industrial");
          this.messagesRef.current.push("Selected segment is industrial");
          if (segment.boundUrbanSegment !== null) {
            this.positionPathToDrawRef.current =
              segment.boundUrbanSegment.positionPathToIndustry;

            this.highlightedSegmentPositions.current.push(
              segment.boundUrbanSegment.position
            );
            this.distanceToTargetRef.current =
              segment.boundUrbanSegment.distanceToIndustry;

            this.messagesRef.current.push(
              "Bound to urban segment at [" +
                segment.boundUrbanSegment.position.x +
                ";" +
                segment.boundUrbanSegment.position.y +
                "]."
            );
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
        this.positionPathToDrawRef.current = [];
        this.distanceToTargetRef.current = 0;
        this.messagesRef.current.push("Selected segment is empty.");
      }
    } else {
      console.log("Segments container is null");
    }
  }
}

export default ExaminationClass;
