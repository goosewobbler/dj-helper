import * as React from 'react';

interface LabelButtonProps {
  backgroundColor?: string;
  className?: string;
  color?: string;
  fontSize?: string;
  height?: string;
  image?: React.ReactElement;
  label: string;
  padding?: string;
  width?: string;
  disabled?: boolean;
  onClick(): void;
}

const LabelButton = ({ className, disabled, onClick, label, image }: LabelButtonProps): React.ReactElement => (
  <button
    type="button"
    className={className}
    disabled={disabled}
    onClick={(event: React.FormEvent): void => {
      event.stopPropagation();
      onClick();
    }}
  >
    {image && <div>{image}</div>}
    <p>{label}</p>
  </button>
);

export default LabelButton;
