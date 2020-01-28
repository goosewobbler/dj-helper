import React, { ReactElement } from 'react';

import ExternalLink from '../../ExternalLink';
import VSCodeIcon from './VSCodeIcon';
import LabelButton from '../../LabelButton';

import { ComponentState, ComponentData } from '../../../../common/types';
import { ComponentHandlers } from '../../../contexts/componentContext';
import Spacer from '../../Spacer';

interface ComponentActionsProps {
  component: ComponentData;
  editors: string[];
  handlers: ComponentHandlers;
}

const renderStateLabel = (state: ComponentState): string => {
  switch (state) {
    case ComponentState.Building:
      return 'BUILDING';
    case ComponentState.Installing:
      return 'INSTALLING';
    case ComponentState.Linking:
      return 'LINKING';
    case ComponentState.Starting:
      return 'STARTING';
    case ComponentState.Running:
      return 'RUNNING';
    default:
      return 'NOT RUNNING';
  }
};

const renderUseCacheButton = (onClick: () => void, useCache: boolean): ReactElement => (
  <div className="flex mt-2 ml-2 wrapper">
    <LabelButton
      className={`use-cache-button${useCache ? ' bg-highlight text-secondary-text' : ''}`}
      label="Cache"
      onClick={onClick}
    />
  </div>
);

const renderBuildButton = (onClick: () => void): ReactElement => (
  <div className="flex mt-2 ml-2 wrapper">
    <LabelButton className="build-button" label="Build" onClick={onClick} />
  </div>
);

const renderInstallButton = (onClick: () => void): ReactElement => (
  <div className="flex mt-2 ml-2 wrapper">
    <LabelButton className="install-button" label="Reinstall" onClick={onClick} />
  </div>
);

const renderCloneButton = (onClick: () => void): ReactElement => (
  <div className="flex mt-2 ml-2 wrapper">
    <LabelButton className="clone-button" label="Clone" onClick={onClick} />
  </div>
);

const ComponentActions = (props: ComponentActionsProps): ReactElement => {
  const {
    editors,
    component: { displayName, state, name, useCache, rendererType },
    handlers: { onOpenInCode, onClone, onInstall, onBuild, onSetUseCache },
  } = props;
  const shouldDisplayInstallButton = state === ComponentState.Stopped || state === ComponentState.Running;
  const shouldDisplayBuildButton = state === ComponentState.Running;
  const shouldDisplayUseCacheButton = state === ComponentState.Stopped || state === ComponentState.Running;
  const isNode10 = rendererType === '10';
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center header">
        <h2 className="flex-grow mt-2 mb-1 ml-2 mr-0 text-3xl text-primary-text">{displayName}</h2>
        <p
          className={`flex-shrink-0 px-2 py-0 m-1 text-base font-bold leading-loose renderer-label ${
            isNode10 ? 'bg-highlight text-secondary-text' : 'bg-tertiary-background text-tertiary-text'
          }`}
        >
          Node version:
          {rendererType}
        </p>
        <p className="flex-shrink-0 px-2 py-0 text-base font-bold leading-loose state-label bg-tertiary-background text-tertiary-text">
          {renderStateLabel(state)}
        </p>
      </div>
      <Spacer />
      <div className="flex flex-wrap justify-start actions">
        <Spacer fill />
        {shouldDisplayUseCacheButton && renderUseCacheButton((): void => onSetUseCache(name, !useCache), useCache)}
        {shouldDisplayBuildButton && renderBuildButton((): void => onBuild(name))}
        {shouldDisplayInstallButton && renderInstallButton((): void => onInstall(name))}
        {renderCloneButton((): void => onClone(name))}
        {editors.includes('code') ? (
          <div className="flex mt-2 ml-2 wrapper " key="vs-code-button">
            <LabelButton
              className="vs-code-button"
              label="VS Code"
              image={<VSCodeIcon />}
              onClick={(): void => onOpenInCode(name)}
            />
          </div>
        ) : null}
        <div className="flex mt-2 ml-2 wrapper">
          <ExternalLink
            label="Dependency Graph"
            link={`https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/${displayName}`}
          />
        </div>
        <div className="flex mt-2 ml-2 wrapper ">
          <ExternalLink label="GitHub" link={`https://github.com/bbc/morph-modules/tree/master/${displayName}`} />
        </div>
      </div>
    </div>
  );
};

export default ComponentActions;
