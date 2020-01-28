import { shell } from 'electron';
import * as React from 'react';
import ExternalIcon from './ExternalIcon';
import { tailwindColorResolver } from '../../helpers/stylesHelper';

interface ExternalLinkProps {
  textColor?: string;
  className?: string;
  backgroundColor?: string;
  height?: string;
  label: string;
  link: string;
  padding?: string;
}

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
  const fillColor = tailwindColorResolver('primary-text');

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
