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
    className={`${className} h-4 w-4 flex-shrink-0 border-none bg-transparent outline-none`}
    onClick={(event: React.FormEvent): void => {
      event.stopPropagation();
      onClick();
    }}
  >
    {children}
    <span className="text-transparent text-hidden">{label}</span>
  </button>
);

export default IconButton;
