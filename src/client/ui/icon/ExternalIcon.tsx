import * as React from 'react';

const ExternalIcon = (props: { colour?: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" fill={props.colour}>
    <path d="M12 0v5h11.5l-5 5H0v22h22V17.5l-2 2V30H2V12h14.5l-7.8 7.7 3.6 3.6L27 8.5V20h5V0" />
  </svg>
);

export default ExternalIcon;
