import {
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Position from "../classes/Position";
import ExamineStatsComponent from "./ExamineStatsComponent";

interface StepperComponentProps {
  positionPath: Position[];
  distanceToTarget: number;
  messages: React.MutableRefObject<string[]>;
}

export default function StepperComponent(props: StepperComponentProps) {
  useEffect(() => {
    setSteps(
      props.positionPath.map((pos) => {
        return {
          label: "Go to [" + pos.x + ";" + pos.y + "]",
          description: "well, go!",
        };
      })
    );
  }, [props.positionPath]);

  const [steps, setSteps] = useState(
    props.positionPath.map((pos) => {
      return {
        label: "Go to [" + pos.x + ";" + pos.y + "]",
        description: "well, go!",
      };
    })
  );

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="absolute top-0  grid grid-rows-6 ">
      <ExamineStatsComponent
        distanceToTarget={props.distanceToTarget}
        turns={props.positionPath.length}
        messages={props.messages.current}
      />

      <Stepper
        nonLinear
        activeStep={activeStep}
        orientation="vertical"
        className=" pt-0 flex-shrink-0 row-span-5"
        sx={{ maxHeight: 666 }}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              onClick={() => setActiveStep(index)}
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {/* <Typography>{step.description}</Typography> */}

              <div>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Previous
                </Button>

                <Button
                  variant="contained"
                  disabled={index >= steps.length - 1}
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Next
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {props.positionPath &&
      props.positionPath.length > 0 &&
      activeStep === steps.length ? (
        <>
          <Typography>All steps completed - you&apos;re finished</Typography>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
