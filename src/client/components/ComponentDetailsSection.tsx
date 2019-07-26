import * as React from 'react';

interface IComponentDetailsSectionProps {
  children?: any;
  grow?: number;
  label: string;
  end?: React.ReactElement<any>;
}

const ComponentDetailsSection = (props: IComponentDetailsSectionProps) => (
  <div>
    <div className="header">
      <h3 className="label">{props.label}</h3>
      {props.end}
    </div>
    <div className="content">{props.children}</div>
  </div>
);

export default ComponentDetailsSection;
