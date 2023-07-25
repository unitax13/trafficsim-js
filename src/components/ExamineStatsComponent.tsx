import { Typography } from "@mui/material";

interface ExamineStatsComponentProps {
  distanceToTarget: number;
  turns: number;
}

export default function ExamineStatsComponent(
  props: ExamineStatsComponentProps
) {
  return (
    <div className="row-span-1">
      <div className="mt-2">
        <div className="font-bold ">
          Total distance: <span>{props.distanceToTarget}</span>
        </div>
        <div className="text-sm text-slate-700">{props.turns} turns</div>
      </div>
    </div>
  );
}
