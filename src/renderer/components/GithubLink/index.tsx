import { shell } from 'electron';
import * as React from 'react';
import GitHubIcon from './GithubIcon';

const GitHubLink = ({ link }: { link: string }): React.ReactElement => {
  return (
    <button
      className="flex-shrink-0 w-8 h-8 m-1 mr-3 text-hidden"
      type="button"
      onClick={(): Promise<void> => shell.openExternal(link)}
    >
      <GitHubIcon />
      View on GitHub
    </button>
  );
};

export default GitHubLink;
