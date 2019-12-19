import * as React from 'react';
import classNames from 'classnames';
import LoadingIcon from '../../../LoadingIcon';

const VersionBox = ({
  children,
  version,
  outdated,
  fontSize,
}: {
  children?: React.ReactElement;
  version: string;
  outdated?: boolean;
  fontSize?: string;
}): React.ReactElement => {
  let contents: React.ReactElement | string = children!;

  if (version === null) {
    contents = (
      <button type="button" disabled>
        <LoadingIcon />
      </button>
    );
  } else if (version === '') {
    contents = 'N/A';
  }

  const classes = ['container'];
  if (outdated) {
    classes.push('outdated');
  }

  return <div className={classNames(classes)}>{contents}</div>;
};

export default VersionBox;
