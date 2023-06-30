import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { SwitchProps } from "@mui/material/Switch";

interface ColorProps extends SwitchProps {
  colorhex: string;
}

const ColoredMuiSwitch = styled(Switch)<ColorProps>(({ theme, colorhex }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: colorhex,
    "&:hover": {
      backgroundColor: alpha(colorhex, theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: colorhex,
  },
}));

export default ColoredMuiSwitch;
