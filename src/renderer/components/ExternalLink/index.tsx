import { shell } from 'electron';
import * as React from 'react';
import { useTailwindColorResolver } from '../../helpers/stylesHelper';

interface ExternalLinkProps {
  textColor?: string;
  className?: string;
  backgroundColor?: string;
  height?: string;
  label: string;
  link: string;
  padding?: string;
}

const ExternalIcon = ({ fillColor }: { fillColor?: string }): React.ReactElement => (
  <svg width="100%" height="100%" viewBox="0 0 32 32" fill={fillColor}>
    <path d="M12 0v5h11.5l-5 5H0v22h22V17.5l-2 2V30H2V12h14.5l-7.8 7.7 3.6 3.6L27 8.5V20h5V0" />
  </svg>
);

const ExternalLink = ({
  className,
  link,
  label,
  textColor = 'primary-text',
  backgroundColor,
  height = 'h-auto',
  padding = 'p-2',
}: ExternalLinkProps): React.ReactElement => {
  const dynamicClasses = [className, padding, height, `text-${textColor}`];
  if (backgroundColor) {
    dynamicClasses.push(`bg-${backgroundColor}`);
  }
  const staticClasses = 'flex-shrink-0 rounded text-base border border-solid border-primary-text-30';
  const fillColor = useTailwindColorResolver('primary-text');

  return (
    <button
      className={`${staticClasses} ${dynamicClasses.join(' ')}`}
      type="button"
      onClick={(): Promise<void> => shell.openExternal(link)}
    >
      <div className="container inline-flex w-3 h-3 my-0 ml-1 mr-2">
        <ExternalIcon fillColor={fillColor} />
      </div>
      <span>{label}</span>
    </button>
  );
};

export default ExternalLink;
