import * as React from 'react';

interface IGitHubLinkProps {
  link: string;
}

const GitHubLink = (props: IGitHubLinkProps) => (
  <a className="github-link" href={props.link} target="_blank">
    View on GitHub
  </a>
);

export default GitHubLink;
