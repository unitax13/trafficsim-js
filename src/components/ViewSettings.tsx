import { FormGroup, FormControlLabel, Button } from "@mui/material";
import colors from "../colors";
import ViewIcon from "../icons/ViewIcon";
import ColoredMuiSwitch from "./ColoredMuiSwitch";
import { useState } from "react";

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
  segmentHighlightIsOn: boolean;
  setSegmentHighlightIsOn: React.Dispatch<React.SetStateAction<boolean>>;
  redraw: () => void;
  heatmapIsOn: boolean;
  setHeatmapIsOn: React.Dispatch<React.SetStateAction<boolean>>;
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
  segmentHighlightIsOn,
  setSegmentHighlightIsOn,
  redraw,
  heatmapIsOn,
  setHeatmapIsOn,
}) => {
  const [viewPanelIsOpen, setViewPanelIsOpen] = useState(false);

  return (
    <>
      <div className="mt-4 w-full h-[358px] row-span-2 flex flex-col items-center min-h-full ">
        <Button
          className="flex gap-1 justify-around items-center hover:outline outline-2 outline-slate-200 py-0"
          onClick={(e) => setViewPanelIsOpen(!viewPanelIsOpen)}
        >
          <p className="text-xs font-roboto text-slate-500">
            {viewPanelIsOpen ? "▼ VIEW" : "▲ VIEW"}
          </p>
          <ViewIcon className="w-5 text-slate-500" />
        </Button>
        <FormGroup
          className={`transition-all ease-linear duration-500 border-2 border-solid border-slate-200 ${
            viewPanelIsOpen ? "hidden" : ""
          }`}
        >
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
          <FormControlLabel
            control={
              <ColoredMuiSwitch
                colorhex={colors.highlightColor}
                color="primary"
                checked={segmentHighlightIsOn}
                onChange={() => {
                  setSegmentHighlightIsOn(!segmentHighlightIsOn);
                  redraw();
                }}
              />
            }
            label="Segment highlight"
          />
          <FormControlLabel
            control={
              <ColoredMuiSwitch
                colorhex={colors.heatColor}
                color="primary"
                checked={heatmapIsOn}
                onChange={() => {
                  setHeatmapIsOn(!heatmapIsOn);
                  redraw();
                }}
              />
            }
            label="Heatmap"
          />
        </FormGroup>
      </div>
    </>
  );
};

export default ViewSettings;
