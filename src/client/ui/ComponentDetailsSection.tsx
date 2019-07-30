import * as React from 'react';

interface ComponentDetailsSectionProps {
  children?: any;
  grow?: number;
  label: string;
  end?: React.ReactElement<any>;
}

const ComponentDetailsSection = (props: ComponentDetailsSectionProps) => (
  <div>
    <div className="header">
      <h3>{props.label}</h3>
      {props.end}
    </div>
    <div className="content">{props.children}</div>
  </div>
);

export default ComponentDetailsSection;
