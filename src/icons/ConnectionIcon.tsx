import { SVGProps } from "react";

//icon-park-outline:connection-point-two
const ConnectionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    className={props.className}
  >
    <g transform="rotate(90 24 24)">
      <g
        fill="none"
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="4"
      >
        <path
          stroke-linecap="round"
          d="M36 8H13c-3 0-9 2-9 8s6 8 9 8h22c3 0 9 2 9 8s-6 8-9 8H12"
        />
        <path d="M40 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8ZM8 44a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" />
      </g>
    </g>
  </svg>
);

export default ConnectionIcon;
