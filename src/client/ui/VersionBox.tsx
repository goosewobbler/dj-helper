import * as React from 'react';

const VersionBox = (props: {
  bad?: boolean;
  fontSize: string;
  good?: boolean;
  height: string;
  padding: string;
  version: string;
  width: string;
}) => {
  let contents: string | React.ReactElement<any> = props.version;
  let backgroundColor = '#aaa';

  if (props.version === null) {
    contents = <img src="/image/icon/gel-icon-loading-white.svg" />;
    backgroundColor = 'orange';
  } else if (props.version === '') {
    contents = 'N/A';
  } else if (props.bad) {
    backgroundColor = 'red';
  } else if (props.good) {
    backgroundColor = '#59bb5d';
  }

  return (
    <div>
      {contents}
    </div>
  );
};

export default VersionBox;
