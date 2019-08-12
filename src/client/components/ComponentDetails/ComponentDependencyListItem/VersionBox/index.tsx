import * as React from 'react';

import LoadingIcon from '../../../LoadingIcon';

const VersionBox = ({ children, version }: { children?: React.ReactElement; version: string }): React.ReactElement => {
  let contents: React.ReactElement | string = children;

  if (version === null) {
    contents = (
      <button type="button" disabled>
        <LoadingIcon />
      </button>
    );
  } else if (version === '') {
    contents = 'N/A';
  }

  return <div className="container">{contents}</div>;
};

export default VersionBox;
