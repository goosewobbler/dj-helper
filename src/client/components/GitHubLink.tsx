import * as React from 'react';

import Theme from '../../types/Theme';
import GitHubIcon from '../ui/icon/GitHubIcon';

interface IGitHubLinkProps {
  link: string;
  theme: Theme;
}

const GitHubLink = (props: IGitHubLinkProps) => (
  <a href={props.link} target="_blank">
    <GitHubIcon colour={props.theme.primaryTextColour} />
    View on GitHub
  </a>
);

export default GitHubLink;
