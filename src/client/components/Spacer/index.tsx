import React, { ReactElement } from 'react';

const Spacer = ({ fill, space }: { fill?: boolean; space?: number }): ReactElement => {
  const flexGrow = fill ? 'flex-grow' : 'flex-grow-0';
  let flexBasis;
  switch (space) {
    case 4:
      flexBasis = 'flex-basis-4';
    case 16:
      flexBasis = 'flex-basis-16';
    default:
      flexBasis = 'flex-basis-8';
  }

  return <div className={`flex-shrink-0 ${flexGrow} ${flexBasis}`}></div>;
};

export default Spacer;
