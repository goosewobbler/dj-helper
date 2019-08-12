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

const createClickAction = (clickAction: () => void) => (event: any): void => {
  event.stopPropagation();
  clickAction();
};

const LabelButton = ({ className, disabled, onClick, label, image }: LabelButtonProps): React.ReactElement => (
  <button type="button" className={className} disabled={disabled} onClick={createClickAction(onClick)}>
    {image && <div>{image}</div>}
    <p>{label}</p>
  </button>
);

export default LabelButton;
