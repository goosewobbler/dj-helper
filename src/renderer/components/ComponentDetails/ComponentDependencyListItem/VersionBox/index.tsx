import * as React from 'react';
import LoadingIcon from '../../../LoadingIcon';

const VersionBox = ({
  children,
  version,
  outdated = false,
  current = false,
  fontSize = 'base',
  padding = 'p-4',
  height = 'h-6',
  width = 'w-12',
}: {
  children?: React.ReactElement;
  version: string;
  padding?: string;
  height?: string;
  width?: string;
  outdated?: boolean;
  current?: boolean;
  fontSize?: string;
}): React.ReactElement => {
  let contents: React.ReactElement | string = children!;
  let backgroundColor = 'bg-neutral';

  if (version === null) {
    contents = (
      <button type="button" disabled className="w-4 h-4 border-0 outline-none loading">
        <LoadingIcon />
      </button>
    );
    backgroundColor = 'bg-loading';
  } else if (version === '') {
    contents = 'N/A';
  } else if (outdated) {
    backgroundColor = 'bg-negative';
  } else if (current) {
    backgroundColor = 'bg-positive';
  }

  return (
    <div
      className={`container items-center flex flex-col content-center rounded text-secondary-text text-${fontSize} ${padding} ${backgroundColor} ${height} ${width}`}
    >
      {contents}
    </div>
  );
};

export default VersionBox;
