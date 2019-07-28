import * as Color from 'color';
import glamorous from 'glamorous';
import * as React from 'react';
import { pure } from 'recompose';

import ITheme from '../../types/ITheme';
import ExternalIcon from './icon/ExternalIcon';

const A = glamorous.a(
  {
    borderRadius: '4px',
    color: 'black',
    flexShrink: 0,
    fontSize: '16px',
    textDecoration: 'none',
  },
  (props: { theme: ITheme; black: boolean; color: string; height: string; padding: string }) => ({
    backgroundColor: props.color,
    border: `1px solid ${Color(props.theme.primaryTextColour).fade(0.7)}`,
    color: props.black ? props.theme.primaryTextColour : props.theme.secondaryTextColour,
    height: props.height || 'auto',
    padding: props.padding || '8px',
  }),
);

const ImageContainerDiv = glamorous.div({
  display: 'inline-flex',
  height: '12px',
  margin: '0 8px 0 4px',
  width: '12px',
});

interface IExternalLinkProps {
  theme: ITheme;
  black?: boolean;
  className?: string;
  color?: string;
  height?: string;
  label: string;
  link: string;
  padding?: string;
}

const ExternalLink = (props: IExternalLinkProps) => (
  <A
    theme={props.theme}
    className={props.className}
    href={props.link}
    target="_blank"
    color={props.color}
    black={props.black}
    padding={props.padding}
    height={props.height}
    onClick={event => event.stopPropagation()}
  >
    <ImageContainerDiv>
      <ExternalIcon colour={props.black ? props.theme.primaryTextColour : props.theme.secondaryTextColour} />
    </ImageContainerDiv>
    <span>{props.label}</span>
  </A>
);

export default pure(ExternalLink);
