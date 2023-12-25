interface ExamineStatsComponentProps {
  messages: string[];
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
        <div className="text-xs text-slate-700">{props.turns} turns</div>
        {props.messages.map((message) => (
          <div className="text-sm text-slate-700">{message}</div>
        ))}
      </div>
    </div>
  );
}
