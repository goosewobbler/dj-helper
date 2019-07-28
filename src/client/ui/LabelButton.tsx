import * as Color from 'color';
import glamorous from 'glamorous';
import * as React from 'react';
import { pure } from 'recompose';

import ITheme from '../../types/ITheme';

const Button = glamorous.button(
  {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
  },
  (props: {
    theme: ITheme;
    backgroundColor: string;
    color: string;
    fontSize: string;
    height: string;
    padding: string;
    width: string;
    disabled: boolean;
  }) => ({
    backgroundColor: props.backgroundColor || 'transparent',
    border: `1px solid ${Color(props.theme.primaryTextColour).fade(0.7)}`,
    color: props.color || props.theme.primaryTextColour,
    fontFamily: props.theme.font,
    fontSize: props.fontSize || '16px',
    height: props.height || 'auto',
    opacity: props.disabled ? 0.2 : 1,
    padding: props.padding || '8px',
    width: props.width || 'auto',
  }),
);

const ImageContainerDiv = glamorous.div(
  {
    display: 'inline-flex',
    height: '12px',
    width: '12px',
  },
  (props: { hasLabel: boolean }) => ({
    margin: props.hasLabel ? '0 8px 0 4px' : '0',
  }),
);

interface ILabelButtonProps {
  theme: ITheme;
  backgroundColor?: string;
  className?: string;
  color?: string;
  fontSize?: string;
  height?: string;
  image?: any;
  label: string;
  padding?: string;
  width?: string;
  disabled?: boolean;
  onClick(): any;
}

const createClickAction = (clickAction: any) => (event: any) => {
  event.stopPropagation();
  clickAction();
};

const renderImage = (props: ILabelButtonProps) => {
  if (props.image) {
    return <ImageContainerDiv hasLabel={Boolean(props.label)}>{props.image}</ImageContainerDiv>;
  }
  return null;
};

const LabelButton = (props: ILabelButtonProps) => (
  <Button
    className={props.className}
    disabled={props.disabled}
    onClick={createClickAction(props.onClick)}
    theme={props.theme}
    color={props.color}
    backgroundColor={props.backgroundColor}
    height={props.height}
    width={props.width}
    fontSize={props.fontSize}
    padding={props.padding}
  >
    {renderImage(props)}
    <p>{props.label}</p>
  </Button>
);

export default pure(LabelButton);
