import * as React from 'react';

const RemoveIcon = ({ colour }: { colour?: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" fill={colour}>
    <path d="M32 3.5L28.5 0 16 12.5 3.5 0 0 3.5 12.5 16 0 28.5 3.5 32 16 19.5 28.5 32l3.5-3.5L19.5 16z" />
  </svg>
);

export default RemoveIcon;
