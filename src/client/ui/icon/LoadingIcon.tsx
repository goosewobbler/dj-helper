import glamorous from 'glamorous';
import * as React from 'react';
import { pure } from 'recompose';

const Spinner = glamorous.div({
  animation: 'spin 0.5s infinite linear',
  height: '100%',
  width: '100%',
});

const LoadingIcon = (props: { colour?: string }) => (
  <Spinner>
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill={props.colour}>
      <path d="M29.8 8l-3.5 2c1 1.8 1.6 3.8 1.6 6 0 6.6-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4V0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16c0-2.9-.8-5.6-2.2-8z" />
    </svg>
  </Spinner>
);

export default pure(LoadingIcon);
