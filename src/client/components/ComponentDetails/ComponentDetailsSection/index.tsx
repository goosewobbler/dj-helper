import * as React from 'react';

interface ComponentDetailsSectionProps {
  children?: React.ReactElement;
  label: string;
  end?: React.ReactElement;
}

const ComponentDetailsSection = ({ label, end, children }: ComponentDetailsSectionProps): React.ReactElement => (
  <div>
    <div className="header">
      <h3 className="label">{label}</h3>
      {end}
    </div>
    <div className="content">{children}</div>
  </div>
);

export default ComponentDetailsSection;
