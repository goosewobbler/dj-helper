import * as React from 'react';

const PauseIcon = ({ colour = '#000' }: { colour?: string }): React.ReactElement => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" fill={colour}>
    <path d="M3 0h9v32H3zm17 0h9v32h-9z" />
  </svg>
);

export default PauseIcon;
