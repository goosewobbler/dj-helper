import * as React from 'react';

import VersionBox from '../ui/VersionBox';
import LoadingIcon from './icons/LoadingIcon';
import LabelButton from '../ui/LabelButton';
import { context, ComponentContext } from '../contexts/componentContext';

import { ComponentState, ComponentData, ComponentDependency } from '../../common/types';

interface ComponentDependencyProps {
  dependency: ComponentDependency;
}

const isLinked = (dependencyName: string, component: ComponentData) =>
  component.dependencies.find(d => d.name === dependencyName).linked;

const isLinking = (dependencyName: string, component: ComponentData) =>
  (component.linking || []).indexOf(dependencyName) > -1;

const isLinkable = ({ state }: ComponentData) => state === ComponentState.Running;

const renderLinkButton = (dependencyName: string, component: ComponentData, onUnlink: any, onLink: any) => {
  if (isLinking(dependencyName, component)) {
    return (
      <div className="loading">
        <img src="/image/icon/gel-icon-loading.svg" />
      </div>
    );
  }

  if (!isLinkable(component)) {
    return null;
  }

  const linked = isLinked(dependencyName, component);

  const className = linked ? 'component-unlink-button' : 'component-link-button';
  const label = linked ? 'Unlink' : 'Link';
  const onClick = linked ? onUnlink : onLink;

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

const ComponentDependencyListItem = ({ dependency }: ComponentDependencyProps) => {
  const componentContext: ComponentContext = React.useContext(context);
  const { onLinkComponent, onUnlinkComponent, onSelectComponent } = componentContext.handlers;
  const { name, displayName, version, outdated, has, latest } = dependency;
  const onLink = () => onLinkComponent(displayName, name);
  const onUnlink = () => onUnlinkComponent(displayName, name);
  const onClick = () => onSelectComponent(name);

  return (
    <li key={name}>
      <div className="component-dependency" onClick={onClick}>
        <span className="component-name-label">{name}</span>
        {renderLinkButton(name, componentContext.component, onUnlink, onLink)}
        {renderVersionBox(version, outdated)}
        {renderVersionBox(has, has && latest && has !== latest)}
        {renderVersionBox(latest, false)}
      </div>
    </li>
  );
};

export default ComponentDependencyListItem;
