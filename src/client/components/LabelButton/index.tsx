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

const LabelButton = ({ className, disabled, onClick, label, image }: LabelButtonProps) => (
  <button className={className} disabled={disabled} onClick={createClickAction(onClick)}>
    {image && <div>{image}</div>}
    <p>{label}</p>
  </button>
);

export default LabelButton;
