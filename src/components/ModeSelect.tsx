import { FormControl, ListItemIcon, MenuItem, Select } from "@mui/material";
import viewModes from "../enums/ViewModes";
import GraphIcon from "../icons/GraphIcon";
import PaintBrush from "../icons/PaintBrush";
import DijkstraIcon from "../icons/DijkstraIcon";
import TrafficFlowIcon from "../icons/TrafficFlowIcon";

export default function ModeSelect(
  modeRef: React.MutableRefObject<viewModes>,
  handleChange: (e: any) => void
) {
  return (
    <>
      <FormControl>
        <Select
          className="w-44 h-9 font-roboto text-xs"
          // disableUnderline

          IconComponent={""}
          value={modeRef.current}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value={viewModes.NORMAL}>
            <span className="flex items-center text-xs ">
              <ListItemIcon sx={{ minWidth: 32 }}>
                <PaintBrush className="w-6 h-6" />
              </ListItemIcon>
              <span>NORMAL MODE</span>
            </span>
          </MenuItem>
          <MenuItem value={viewModes.SHORTEST_PATHING}>
            <span className="flex items-center text-xs">
              <ListItemIcon sx={{ minWidth: 32 }}>
                <DijkstraIcon className="w-6 h-6" />
              </ListItemIcon>
              <span className="text-left">SHORTEST-PATHING MODE</span>
            </span>
          </MenuItem>
          <MenuItem value={viewModes.HEATMAP} disabled={true}>
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
  );
}
