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

interface StepperComponentProps {
  positionPath: Position[];
}

export default function StepperComponent(props: StepperComponentProps) {
  const steps2 = [
    {
      label: "Select campaign settings",
      description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
    },
    {
      label: "Create an ad group",
      description:
        "An ad group contains one or more ads which target a shared set of keywords.",
    },
    {
      label: "Create an ad",
      description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    },
  ];

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
    <>
      <Stepper
        nonLinear
        activeStep={activeStep}
        orientation="vertical"
        className=" pt-0"
        sx={{ maxHeight: 666 }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
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
              <Typography>{step.description}</Typography>

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
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </>
      )}
    </>
  );
}
