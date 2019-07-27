import * as React from 'react';

import VersionBox from '../ui/VersionBox';
import LabelButton from './LabelButton';

interface IComponentDependencyProps {
  dependency: string;
  latest: string;
  has: string;
  version: string;
  outdated: boolean;
  linkableState: boolean;
  linked: boolean;
  linking: boolean;
  onClick(): any;
  onLinkComponent(): any;
  onUnlinkComponent(): any;
}

const getBackgroundColour = (props: IComponentDependencyProps) => {
  if (props.linking) {
    return 'orange';
  }
  if (props.linked) {
    return '#c9ffc9';
  }
  return 'white';
};

const renderLinkButton = (props: IComponentDependencyProps) => {
  if (props.linking) {
    return (
      <div className="loading">
        <img src="/image/icon/gel-icon-loading.svg" />
      </div>
    );
  }

  if (!props.linkableState) {
    return null;
  }

  const className = props.linked ? 'component-unlink-button' : 'component-link-button';
  const label = props.linked ? 'Unlink' : 'Link';
  const onClick = props.linked ? props.onUnlinkComponent : props.onLinkComponent;

  return (
    <LabelButton
      className={className}
      label={label}
      padding="0 4px"
      fontSize="12px"
      height="24px"
      width="50px"
      onClick={onClick}
      backgroundColor="white"
    />
  );
};

const renderVersionBox = (version: string, outdated: boolean) => (
  <VersionBox version={version} bad={outdated} fontSize="14px" height="24px" width="60px" padding="0 4px" />
);

const ComponentDependency = (props: IComponentDependencyProps) => (
  <div className="component-dependency" onClick={props.onClick}>
    <span className="component-name-label">{props.dependency}</span>
    {renderLinkButton(props)}
    {renderVersionBox(props.version, props.outdated)}
    {renderVersionBox(props.has, props.has && props.latest && props.has !== props.latest)}
    {renderVersionBox(props.latest, false)}
  </div>
);

export default ComponentDependency;
