import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { SwitchProps } from "@mui/material/Switch";

interface ColorProps extends SwitchProps {
  colorHex: string;
}

const ColoredMuiSwitch = styled(Switch)<ColorProps>(({ theme, colorHex }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: colorHex,
    "&:hover": {
      backgroundColor: alpha(colorHex, theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: colorHex,
  },
}));

export default ColoredMuiSwitch;
