import React, { ReactElement } from 'react';

const Spacer = ({ fill = false, space = 8 }: { fill?: boolean; space?: number }): ReactElement => {
  const flexGrow = fill ? 'flex-grow' : 'flex-grow-0';
  const flexBasis = `flex-basis-${space}`;

  return <div className={`flex-shrink-0 ${flexGrow} ${flexBasis}`} />;
};

export default Spacer;
