import { shell } from 'electron';
import * as React from 'react';
import tw from 'tailwind.macro';

import GitHubIcon from './GithubIcon';

const GitHubLink = ({ link }: { link: string }): React.ReactElement => {
  const fillColor = tw`text-primary-text`.color;
  return (
    <button
      className="w-8 h-8 m-1 mr-3 flex-shrink-0 text-hidden"
      type="button"
      onClick={(): Promise<void> => shell.openExternal(link)}
    >
      <GitHubIcon fillColor={fillColor} />
      View on GitHub
    </button>
  );
};

export default GitHubLink;
