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

const renderUseCacheButton = (onClick: () => void, className: string): ReactElement => (
  <div className="wrapper">
    <LabelButton className={className} label="Cache" onClick={onClick} />
  </div>
);

const renderBuildButton = (onClick: () => void): ReactElement => (
  <div className="wrapper">
    <LabelButton className="build-button" label="Build" onClick={onClick} />
  </div>
);

const renderInstallButton = (onClick: () => void): ReactElement => (
  <div className="wrapper">
    <LabelButton className="install-button" label="Reinstall" onClick={onClick} />
  </div>
);

const renderCloneButton = (onClick: () => void): ReactElement => (
  <div className="wrapper">
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
  return (
    <div>
      <div className="header">
        <h2>{displayName}</h2>
        <p className="renderer-label">
          Node version:
          {rendererType}
        </p>
        <p className="state-label">{renderStateLabel(state)}</p>
      </div>
      <Spacer />
      <div className="actions">
        <Spacer fill />
        {shouldDisplayUseCacheButton &&
          renderUseCacheButton(
            (): void => onSetUseCache(name, !useCache),
            useCache ? 'no-use-cache-button' : 'use-cache-button',
          )}
        {shouldDisplayBuildButton && renderBuildButton((): void => onBuild(name))}
        {shouldDisplayInstallButton && renderInstallButton((): void => onInstall(name))}
        {renderCloneButton((): void => onClone(name))}
        {editors.includes('code') ? (
          <div className="wrapper" key="vs-code-button">
            <LabelButton
              className="vs-code-button"
              label="VS Code"
              image={<VSCodeIcon />}
              onClick={(): void => onOpenInCode(name)}
            />
          </div>
        ) : null}
        <div className="wrapper">
          <ExternalLink
            label="Dependency Graph"
            link={`https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/${displayName}`}
            black
          />
        </div>
        <div className="wrapper">
          <ExternalLink label="GitHub" link={`https://github.com/bbc/morph-modules/tree/master/${displayName}`} black />
        </div>
      </div>
    </div>
  );
};

export default ComponentActions;
