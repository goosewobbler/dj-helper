import React, { ReactElement, useContext } from 'react';

import VersionBox from './VersionBox';
import LabelButton from '../../LabelButton';
import { context, ComponentContext } from '../../../contexts/componentContext';

import { ComponentState, ComponentData, ComponentDependency } from '../../../../common/types';

interface ComponentDependencyProps {
  dependency: ComponentDependency;
}

const isLinked = (dependencyName: string, component: ComponentData): boolean =>
  component.dependencies.find((d): boolean => d.name === dependencyName).linked;

const isLinking = (dependencyName: string, component: ComponentData): boolean =>
  (component.linking || []).indexOf(dependencyName) > -1;

const isLinkable = ({ state }: ComponentData): boolean => state === ComponentState.Running;

const renderLinkButton = (
  dependencyName: string,
  component: ComponentData,
  onUnlink: () => void,
  onLink: () => void,
): ReactElement => {
  if (isLinking(dependencyName, component)) {
    return (
      <div className="loading">
        <img alt="loading" src="/image/icon/gel-icon-loading.svg" />
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

const renderVersionBox = (version: string, outdated: boolean): ReactElement => (
  <VersionBox version={version} outdated={outdated} />
);

const ComponentDependencyListItem = ({ dependency }: ComponentDependencyProps): ReactElement => {
  const componentContext: ComponentContext = useContext(context);
  const { onLinkComponent, onUnlinkComponent, onSelectComponent } = componentContext.handlers;
  const { name, displayName, version, outdated, has, latest } = dependency;
  const onLink = (): void => onLinkComponent(displayName, name);
  const onUnlink = (): void => onUnlinkComponent(displayName, name);
  const onClick = (): void => onSelectComponent(name);

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
