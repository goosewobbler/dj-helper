import * as React from 'react';

import GitHubIcon from './GithubIcon';

const GitHubLink = ({ link }: { link: string }): React.ReactElement => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <GitHubIcon />
    View on GitHub
  </a>
);

export default GitHubLink;
