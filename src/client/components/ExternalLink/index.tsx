import * as React from 'react';

import ExternalIcon from './ExternalIcon';

interface ExternalLinkProps {
  black?: boolean;
  className?: string;
  color?: string;
  height?: string;
  label: string;
  link: string;
  padding?: string;
}

const ExternalLink = ({ className, link, label }: ExternalLinkProps): React.ReactElement => (
  <a
    className={className}
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    onClick={event => event.stopPropagation()}
  >
    <div className="container">
      <ExternalIcon />
    </div>
    <span>{label}</span>
  </a>
);

export default ExternalLink;
