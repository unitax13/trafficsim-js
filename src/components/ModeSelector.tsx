import {
  FormControl,
  ListItemIcon,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { MutableRefObject, ReactEventHandler } from "react";
import DijkstraIcon from "../icons/DijkstraIcon";
import TrafficFlowIcon from "../icons/TrafficFlowIcon";
import viewModes from "../enums/ViewModes";
import PaintBrush from "../icons/PaintBrush";

interface ModeSelectorProps {
  viewMode: MutableRefObject<viewModes>;
  handleModeChange: (e: SelectChangeEvent<string>) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  viewMode,
  handleModeChange,
}) => {
  return (
    <div className="border-2 border-slate-200 border-solid">
      <div>
        <>
          <FormControl>
            <Select
              className="w-44 h-9 font-roboto text-xs"
              value={viewMode.current}
              onChange={handleModeChange}
            >
              <MenuItem
                value={viewModes.NORMAL}
                className="focus:border focus:border-solid"
              >
                <span className="flex items-center text-xs">
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <PaintBrush className="w-6 h-6" />
                  </ListItemIcon>
                  <span>NORMAL MODE</span>
                </span>
              </MenuItem>
              <MenuItem
                value={viewModes.SHORTEST_PATHING}
                className="focus:border focus:border-solid"
              >
                <span className="flex items-center text-xs">
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <DijkstraIcon className="w-6 h-6" />
                  </ListItemIcon>
                  <span className="text-left">SHORTEST-PATHING MODE</span>
                </span>
              </MenuItem>
              <MenuItem
                value={viewModes.HEATMAP}
                disabled={true}
                className="focus:border focus:border-solid"
              >
                <span className="flex items-center text-xs">
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <TrafficFlowIcon className="w-6 h-6" />
                  </ListItemIcon>
                  <span className="text-left">HEATMAP MODE</span>
                </span>
              </MenuItem>
            </Select>
          </FormControl>
        </>
      </div>
    </div>
  );
};

export default ModeSelector;
