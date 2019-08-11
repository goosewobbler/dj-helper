import * as React from 'react';

import GitHubIcon from './GithubIcon';

interface GitHubLinkProps {
  link: string;
}

const GitHubLink = (props: GitHubLinkProps) => (
  <a href={props.link} target="_blank" rel="noopener noreferrer">
    <GitHubIcon />
    View on GitHub
  </a>
);

export default GitHubLink;
