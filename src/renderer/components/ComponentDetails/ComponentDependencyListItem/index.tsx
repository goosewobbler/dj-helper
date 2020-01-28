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
  linked: boolean,
  linking: boolean,
  onUnlink: () => void,
  onLink: () => void,
): ReactElement | null => {
  if (linking) {
    return (
      <button type="button" disabled className="w-4 h-4 border-0 outline-none loading">
        <LoadingIcon />
      </button>
    );
  }

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
  <VersionBox version={version} outdated={outdated} fontSize="sm" padding="py-1 px-0">
    <>{version}</>
  </VersionBox>
);

const ComponentDependencyListItem = ({ dependency }: ComponentDependencyProps): ReactElement => {
  const componentContext: ComponentContext = useContext(context)!;
  const { onLinkComponent, onUnlinkComponent, onSelectComponent } = componentContext.handlers;
  const { name, displayName, version, outdated, has, latest } = dependency;
  const onLink = (): void => onLinkComponent(displayName, name);
  const onUnlink = (): void => onUnlinkComponent(displayName, name);
  const onClick = (): void => onSelectComponent(name);
  const onKeyPress = (): void => onSelectComponent(name);

  const componentIsLinked = isLinked(name, componentContext.component);
  const componentIsLinking = isLinking(name, componentContext.component);
  const componentIsLinkable = isLinkable(componentContext.component);

  let backgroundColor = 'bg-secondary-background';

  if (componentIsLinking) {
    backgroundColor = 'bg-component-starting';
  } else if (componentIsLinked) {
    backgroundColor = 'bg-component-linked';
  }

  return (
    <li key={name}>
      <div
        className={`border component-dependency-shadow border-solid border-selected-item-border flex items-center flex-grow h-10 p-2 mb-2 overflow-hidden cursor-pointer text-primary-text component-dependency ${backgroundColor}`}
        onClick={onClick}
        role="link"
        onKeyPress={onKeyPress}
        tabIndex={0}
      >
        <span className="mr-auto truncate component-name-label">{name}</span>
        <Spacer fill />
        {componentIsLinkable && renderLinkButton(componentIsLinked, componentIsLinking, onUnlink, onLink)}
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
