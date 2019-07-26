import * as React from 'react';

import IComponentData from '../../types/IComponentData';
import ComponentActions from './ComponentActions';
import ComponentDependencies from './ComponentDependencies';
import ComponentDetailsSection from './ComponentDetailsSection';
import ComponentVersions from './ComponentVersions';

interface IComponentDetailsProps {
  component?: IComponentData;
  editors: string[];
  onOpenInCode(name: string): any;
  onBuild(name: string): any;
  onInstall(name: string): any;
  onSetUseCache(name: string, value: boolean): any;
  onBumpComponent(name: string, type: string): any;
  onPromoteComponent(name: string, environment: string): any;
  onSelectComponent(name: string): any;
  onLinkComponent(name: string, dependency: string): any;
  onUnlinkComponent(name: string, dependency: string): any;
}

const renderDetailsSectionEnd = () => (
  <div className="dependencies-heading">
    <h4>Wants</h4>
    <h4>Bundled</h4>
    <h4>Latest</h4>
  </div>
);

const renderDependenciesSection = (props: IComponentDetailsProps) => {
  if (Array.isArray(props.component.dependencies) && props.component.dependencies.length > 0) {
    return (
      <ComponentDetailsSection label="Dependencies" grow={1} end={renderDetailsSectionEnd()}>
        <ComponentDependencies
          component={props.component}
          onSelectComponent={props.onSelectComponent}
          onLinkComponent={props.onLinkComponent}
          onUnlinkComponent={props.onUnlinkComponent}
        />
      </ComponentDetailsSection>
    );
  }
  return null;
};

const renderDetails = (props: IComponentDetailsProps) => (
  <div className="details">
    <div className="actions">
      <ComponentActions
        component={props.component}
        editors={props.editors}
        onOpenInCode={props.onOpenInCode}
        onBuild={props.onBuild}
        onInstall={props.onInstall}
        onSetUseCache={props.onSetUseCache}
      />
    </div>
    <ComponentDetailsSection label="Versions">
      <ComponentVersions
        component={props.component}
        onBumpComponent={props.onBumpComponent}
        onPromoteComponent={props.onPromoteComponent}
      />
    </ComponentDetailsSection>
    {renderDependenciesSection(props)}
  </div>
);

const renderPlaceholder = () => (
  <div className="placeholder">
    <p>No component selected</p>
  </div>
);

const ComponentDetails = (props: IComponentDetailsProps) =>
  props.component ? renderDetails(props) : renderPlaceholder();

export default ComponentDetails;
