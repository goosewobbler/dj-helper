import * as React from 'react';

const TopIcon = ({ colour }: { colour?: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 32 31.9" fill={colour}>
    <g>
      <path d="M0 1.9h32v3H0zM16 4.9l16 25h-8.2L16 16.6 8.2 29.9H0z" />
    </g>
  </svg>
);

export default TopIcon;
