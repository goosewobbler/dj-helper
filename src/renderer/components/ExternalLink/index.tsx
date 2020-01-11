import * as React from 'react';
import tw from 'tailwind.macro';
import ExternalIcon from './ExternalIcon';

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
  textColor = 'text-color-primary-text',
  backgroundColor = 'bg-black',
  height = 'h-auto',
  padding = 'p-2',
}: ExternalLinkProps): React.ReactElement => {
  const dynamicClasses = [className, padding, height, textColor, backgroundColor].join(' ');
  const fillColor = tw`${textColor}`.color;

  // TODO: check no-underline is needed
  return (
    <a
      className={`flex-shrink-0 rounded text-base border border-solid border-color-primary-text-30 ${dynamicClasses}`}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event): void => event.stopPropagation()}
    >
      <div className="container inline-flex w-3 h-3 my-0 mr-2 ml-1 no-underline text-black">
        <ExternalIcon fillColor={fillColor} />
      </div>
      <span>{label}</span>
    </a>
  );
};

export default ExternalLink;
