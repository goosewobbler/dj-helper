import * as React from 'react';

import GitHubIcon from '../ui/icon/GitHubIcon';

interface IGitHubLinkProps {
  link: string;
}

const GitHubLink = (props: IGitHubLinkProps) => (
  <a href={props.link} target="_blank">
    <GitHubIcon />
    View on GitHub
  </a>
);

export default GitHubLink;
