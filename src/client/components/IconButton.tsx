import * as React from 'react';

interface IconButtonProps {
  children?: any;
  className?: string;
  label: string;
  loading?: boolean;
  onClick?(): void;
}

const createClickAction = (clickAction: any) => (event: any) => {
  event.stopPropagation();
  clickAction();
};

const IconButton = (props: IconButtonProps) => (
  <button className={props.className} onClick={createClickAction(props.onClick)}>
    {props.children}
    <span>{props.label}</span>
  </button>
);

export default IconButton;
