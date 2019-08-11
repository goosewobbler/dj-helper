import * as React from 'react';

interface LabelButtonProps {
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

const renderImage = (props: LabelButtonProps) => {
  if (props.image) {
    return <div>{props.image}</div>;
  }
  return null;
};

const LabelButton = (props: LabelButtonProps) => (
  <button className={props.className} disabled={props.disabled} onClick={createClickAction(props.onClick)}>
    {renderImage(props)}
    <p>{props.label}</p>
  </button>
);

export default LabelButton;
