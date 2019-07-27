import * as React from 'react';

interface ILabelButtonProps {
  backgroundColor?: string;
  className?: string;
  color?: string;
  fontSize?: string;
  height?: string;
  image?: string;
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

const LabelButton = (props: ILabelButtonProps) => (
  <button className={props.className} disabled={props.disabled} onClick={createClickAction(props.onClick)}>
    {props.image ? <img src={props.image} /> : null}
    <p>{props.label}</p>
  </button>
);

export default LabelButton;
