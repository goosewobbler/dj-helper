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

const IconButton = ({ className, onClick, children, label }: IconButtonProps): React.ReactElement => (
  <button type="button" className={className} onClick={createClickAction(onClick)}>
    {children}
    <span>{label}</span>
  </button>
);

export default IconButton;
