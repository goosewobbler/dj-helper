import * as React from 'react';

import GitHubIcon from './GithubIcon';

//color: 'transparent',
//flexShrink: 0,
//fontSize: '0',
//height: '32px',
//lineHeight: '0',
//margin: '2px 10px 2px 2px',
//width: '32px',

const GitHubLink = ({ link }: { link: string }): React.ReactElement => (
  <a className="w-8 h-8 m-1 mr-3 flex-shrink-0" href={link} target="_blank" rel="noopener noreferrer">
    <GitHubIcon />
    View on GitHub
  </a>
);

export default GitHubLink;
