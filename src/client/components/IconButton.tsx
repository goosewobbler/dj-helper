import * as React from 'react';

interface IIconButtonProps {
  className?: string;
  image?: string;
  label: string;
  loading?: boolean;
  onClick?(): null;
}

const createClickAction = (clickAction: any) => (event: any) => {
  event.stopPropagation();
  clickAction();
};

const IconButton = (props: IIconButtonProps) => (
  <button className={props.className} onClick={createClickAction(props.onClick)}>
    <img src={props.loading ? '/image/icon/gel-icon-loading.svg' : props.image} />
    <span>{props.label}</span>
  </button>
);

export default IconButton;
