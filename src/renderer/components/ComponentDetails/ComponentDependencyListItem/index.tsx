import React, { ReactElement, useContext } from 'react';

import VersionBox from './VersionBox';
import LabelButton from '../../LabelButton';
import { context, ComponentContext } from '../../../contexts/componentContext';

import { ComponentState, ComponentData, ComponentDependency } from '../../../../common/types';
import Spacer from '../../Spacer';
import LoadingIcon from '../../LoadingIcon';

interface ComponentDependencyProps {
  dependency: ComponentDependency;
}

const isLinked = (dependencyName: string, component: ComponentData): boolean =>
  component?.dependencies?.find((d): boolean => d.name === dependencyName)!.linked;

const isLinking = (dependencyName: string, component: ComponentData): boolean =>
  (component.linking || []).includes(dependencyName);

const isLinkable = ({ state }: ComponentData): boolean => state === ComponentState.Running;

const renderLinkButton = (
  dependencyName: string,
  component: ComponentData,
  onUnlink: () => void,
  onLink: () => void,
): ReactElement | null => {
  if (isLinking(dependencyName, component)) {
    return (
      <button type="button" disabled className="w-4 h-4 border-0 outline-none loading">
        <LoadingIcon />
      </button>
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
      padding="px-1"
      fontSize="xs"
      height="6"
      width="12"
      onClick={onClick}
      backgroundColor="white"
    />
  );
};

const renderVersionBox = (version: string, outdated: boolean): ReactElement => (
  <VersionBox version={version} outdated={outdated} fontSize="sm" padding="py-1 px-0" />
);

const ComponentDependencyListItem = ({ dependency }: ComponentDependencyProps): ReactElement => {
  const componentContext: ComponentContext = useContext(context)!;
  const { onLinkComponent, onUnlinkComponent, onSelectComponent } = componentContext.handlers;
  const { name, displayName, version, outdated, has, latest } = dependency;
  const onLink = (): void => onLinkComponent(displayName, name);
  const onUnlink = (): void => onUnlinkComponent(displayName, name);
  const onClick = (): void => onSelectComponent(name);
  const onKeyPress = (): void => onSelectComponent(name);

  return (
    <li key={name}>
      <div className="component-dependency" onClick={onClick} role="link" onKeyPress={onKeyPress} tabIndex={0}>
        <span className="component-name-label">{name}</span>
        <Spacer fill />
        {renderLinkButton(name, componentContext.component, onUnlink, onLink)}
        <Spacer />
        {renderVersionBox(version!, outdated)}
        <Spacer />
        {renderVersionBox(has!, !!has && !!latest && has !== latest)}
        <Spacer />
        {renderVersionBox(latest!, false)}
      </div>
    </li>
  );
};

export default ComponentDependencyListItem;
