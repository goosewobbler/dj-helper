import * as React from 'react';
import { pure } from 'recompose';

const PlayIcon = (props: { colour?: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" fill={props.colour}>
    <path d="M3 32l26-16L3 0" />
  </svg>
);

export default pure(PlayIcon);
