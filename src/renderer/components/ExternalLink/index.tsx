import * as React from 'react';
import ExternalIcon from './ExternalIcon';
import { getColorFromTailwindConfig } from '../../helpers/stylesHelper';

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
  const fillColor = getColorFromTailwindConfig('primary-text');

  return (
    <a
      className={`${staticClasses} ${dynamicClasses.join(' ')}`}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event): void => event.stopPropagation()}
    >
      <div className="container inline-flex w-3 h-3 my-0 ml-1 mr-2">
        <ExternalIcon fillColor={fillColor} />
      </div>
      <span>{label}</span>
    </a>
  );
};

export default ExternalLink;
