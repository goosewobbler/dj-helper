import React, { ReactElement } from 'react';

const Spacer = ({ fill, space }: { fill?: boolean; space?: number }): ReactElement => {
  const flexGrow = fill ? 'flex-grow' : 'flex-grow-0';
  const flexBasisSpaceValues = [4, 16];
  const flexBasis = flexBasisSpaceValues.includes(space!) ? `flex-basis-${space}` : 'flex-basis-8';

  return <div className={`flex-shrink-0 ${flexGrow} ${flexBasis}`}></div>;
};

export default Spacer;
