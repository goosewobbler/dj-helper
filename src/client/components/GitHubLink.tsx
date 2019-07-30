import * as React from 'react';

import GitHubIcon from '../ui/icon/GitHubIcon';

interface GitHubLinkProps {
  link: string;
}

const GitHubLink = (props: GitHubLinkProps) => (
  <a href={props.link} target="_blank">
    <GitHubIcon />
    View on GitHub
  </a>
);

export default GitHubLink;
