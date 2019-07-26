import * as React from 'react';

interface IExternalLinkProps {
  black?: boolean;
  className?: string;
  color?: string;
  height?: string;
  label: string;
  link: string;
  padding?: string;
}

const ExternalLink = (props: IExternalLinkProps) => (
  <a
    className={props.className}
    href={props.link}
    target="_blank"
    color={props.color}
    onClick={event => event.stopPropagation()}
  >
    <img alt="external link" src={`/image/icon/gel-icon-external-link-${props.black ? 'black' : 'white'}.svg`} />
    <span>{props.label}</span>
  </a>
);

export default ExternalLink;
