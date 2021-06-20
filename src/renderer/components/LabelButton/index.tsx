import * as React from 'react';

interface LabelButtonProps {
  backgroundColor?: string;
  className?: string;
  fontSize?: string;
  height?: string;
  image?: React.ReactElement;
  label: string;
  padding?: string;
  width?: string;
  disabled?: boolean;
  onClick(): void;
}

const LabelButton = ({
  className,
  disabled,
  onClick,
  label,
  image,
  width = 'auto',
  height = 'auto',
  padding = 'p-2',
  backgroundColor = 'transparent',
  fontSize = 'base',
}: LabelButtonProps): React.ReactElement => {
  const borderColor = `border-primary-text-70`;
  const opacity = `opacity-${disabled ? '25' : '100'}`;
  const dynamicClasses = [
    className,
    borderColor,
    opacity,
    padding,
    `w-${width}`,
    `h-${height}`,
    `text-${fontSize}`,
    `bg-${backgroundColor}`,
  ].join(' ');

  return (
    <button
      type="button"
      className={`flex flex-shrink-0 rounded items-center justify-center border border-solid ${dynamicClasses}`}
      disabled={disabled}
      onClick={(event: React.FormEvent): void => {
        event.stopPropagation();
        onClick();
      }}
    >
      {image && <div className={`inline-flex h-3 w-3 ${label ? 'mr-2 ml-1' : 'm-0'}`}>{image}</div>}
      <p>{label}</p>
    </button>
  );
};

export default LabelButton;
