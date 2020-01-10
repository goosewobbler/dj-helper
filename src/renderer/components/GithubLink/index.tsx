import { shell } from 'electron';
import * as React from 'react';

import GitHubIcon from './GithubIcon';
import { context, AppContext } from '../../contexts/appContext';

const GitHubLink = ({ link }: { link: string }): React.ReactElement => {
  const { theme } = React.useContext(context) as AppContext;
  return (
    <button
      className="w-8 h-8 m-1 mr-3 flex-shrink-0 text-hidden"
      type="button"
      onClick={(): Promise<void> => shell.openExternal(link)}
    >
      <GitHubIcon colour={theme.primaryTextColour} />
      View on GitHub
    </button>
  );
};

export default GitHubLink;
