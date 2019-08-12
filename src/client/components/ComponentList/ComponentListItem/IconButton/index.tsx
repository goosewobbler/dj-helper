import * as React from 'react';

interface IconButtonProps {
  children?: React.ReactElement;
  className?: string;
  label: string;
  loading?: boolean;
  onClick?(): void;
}

const IconButton = ({ className, onClick, children, label }: IconButtonProps): React.ReactElement => (
  <button
    type="button"
    className={className}
    onClick={(event: React.FormEvent): void => {
      event.stopPropagation();
      onClick();
    }}
  >
    {children}
    <span>{label}</span>
  </button>
);

export default IconButton;
