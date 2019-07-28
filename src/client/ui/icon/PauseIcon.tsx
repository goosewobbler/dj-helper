import * as React from 'react';
import { pure } from 'recompose';

const PauseIcon = (props: { colour?: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" fill={props.colour}>
    <path d="M3 0h9v32H3zm17 0h9v32h-9z" />
  </svg>
);

export default pure(PauseIcon);
