import { FormGroup, FormControlLabel } from "@mui/material";
import colors from "../colors";
import ViewIcon from "../icons/ViewIcon";
import ColoredMuiSwitch from "./ColoredMuiSwitch";

interface ViewSettingsProps {
  roadsIsOn: boolean;
  setRoadsIsOn: React.Dispatch<React.SetStateAction<boolean>>;
  urbanIsOn: boolean;
  setUrbanIsOn: React.Dispatch<React.SetStateAction<boolean>>;
  industryIsOn: boolean;
  setIndustryIsOn: React.Dispatch<React.SetStateAction<boolean>>;
  nodeNumbersAreOn: boolean;
  setNodeNumbersAreOn: React.Dispatch<React.SetStateAction<boolean>>;
  gridIsOn: boolean;
  setGridIsOn: React.Dispatch<React.SetStateAction<boolean>>;
  pathIsOn: boolean;
  setPathIsOn: React.Dispatch<React.SetStateAction<boolean>>;
  redraw: () => void;
}

const ViewSettings: React.FC<ViewSettingsProps> = ({
  roadsIsOn,
  setRoadsIsOn,
  urbanIsOn,
  setUrbanIsOn,
  industryIsOn,
  setIndustryIsOn,
  nodeNumbersAreOn,
  setNodeNumbersAreOn,
  gridIsOn,
  setGridIsOn,
  pathIsOn,
  setPathIsOn,
  redraw,
}) => {
  return (
    <>
      <div className="flex gap-1 justify-around items-center">
        <p className="text-xs font-roboto text-slate-500">▼ VIEW</p>
        <ViewIcon className="w-5 text-slate-500" />
      </div>
      <FormGroup className="border border-2 border-solid border-slate-200">
        <FormControlLabel
          control={
            <ColoredMuiSwitch
              colorhex={colors.roads}
              color="primary"
              checked={roadsIsOn}
              onChange={() => {
                setRoadsIsOn(!roadsIsOn);
                redraw();
              }}
            />
          }
          label="Roads"
        />
        <FormControlLabel
          control={
            <ColoredMuiSwitch
              colorhex={colors.urban}
              color="primary"
              checked={urbanIsOn}
              onChange={() => {
                setUrbanIsOn(!urbanIsOn);
                redraw();
              }}
            />
          }
          label="Urban"
        />
        <FormControlLabel
          control={
            <ColoredMuiSwitch
              colorhex={colors.industry}
              color="primary"
              checked={industryIsOn}
              onChange={() => {
                setIndustryIsOn(!industryIsOn);
                redraw();
              }}
            />
          }
          label="Industry"
        />
        <FormControlLabel
          control={
            <ColoredMuiSwitch
              colorhex={colors.graphColor}
              color="primary"
              checked={nodeNumbersAreOn}
              onChange={() => {
                setNodeNumbersAreOn(!nodeNumbersAreOn);
                redraw();
              }}
            />
          }
          label="Node numbers"
        />
        <FormControlLabel
          control={
            <ColoredMuiSwitch
              colorhex="#111111"
              color="primary"
              checked={gridIsOn}
              onChange={() => {
                setGridIsOn(!gridIsOn);
                redraw();
              }}
            />
          }
          label="Grid"
        />
        <FormControlLabel
          control={
            <ColoredMuiSwitch
              colorhex={colors.pathColor}
              color="primary"
              checked={pathIsOn}
              onChange={() => {
                setPathIsOn(!pathIsOn);
                redraw();
              }}
            />
          }
          label="Path"
        />
      </FormGroup>
    </>
  );
};

export default ViewSettings;