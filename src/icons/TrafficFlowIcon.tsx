//carbon:traffic-flow
import { SVGProps } from "react";

const TrafficFlowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    className={props.className}
  >
    <g transform="rotate(90 16 16)">
      <path
        fill="currentColor"
        d="m26 8l-4-4l-4 4l1.41 1.42L21 7.83V18h2V7.83l1.58 1.58L26 8zM12.59 22.58L11 24.17V14H9v10.17l-1.58-1.58L6 24l4 4l4-4l-1.41-1.42zM2 2h2v28H2zm26 0h2v28h-2zM15 2h2v4h-2zm0 8h2v4h-2zm0 8h2v4h-2zm0 8h2v4h-2z"
      />
    </g>
  </svg>
);

export default TrafficFlowIcon;
