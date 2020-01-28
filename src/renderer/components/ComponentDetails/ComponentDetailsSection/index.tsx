import * as React from 'react';

interface ComponentDetailsSectionProps {
  children?: React.ReactElement;
  grow?: boolean;
  label: string;
  end?: React.ReactElement;
}

const ComponentDetailsSection = ({ label, end, children, grow }: ComponentDetailsSectionProps): React.ReactElement => {
  const additionalFlexClasses = grow ? 'flex-grow flex-shrink' : 'flex-grow-0 flex-shrink-0';
  const flexClasses = `flex flex-col ${additionalFlexClasses}`;
  return (
    <div className={flexClasses}>
      <div className="flex justify-between mx-2 mt-5 mb-2 header">
        <h3 className="label">{label}</h3>
        {end}
      </div>
      <div className={`content ${flexClasses}`}>{children}</div>
    </div>
  );
};

export default ComponentDetailsSection;
