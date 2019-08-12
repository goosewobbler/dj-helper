import * as React from 'react';

const PlayIcon = ({ colour }: { colour?: string }): React.ReactElement => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" fill={colour}>
    <path d="M3 32l26-16L3 0" />
  </svg>
);

export default PlayIcon;
