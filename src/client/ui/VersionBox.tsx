import * as React from 'react';

import LoadingIcon from '../components/icons/LoadingIcon';

const VersionBox = (props: {
  children?: any;
  bad?: boolean;
  fontSize: string;
  good?: boolean;
  height: string;
  padding: string;
  version: any;
  width: string;
}) => {
  let contents: any = props.children;

  if (props.version === null) {
    contents = (
      <button disabled>
        <LoadingIcon />
      </button>
    );
  } else if (props.version === '') {
    contents = 'N/A';
  }

  return <div className="container">{contents}</div>;
};

export default VersionBox;
