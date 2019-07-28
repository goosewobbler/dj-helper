import * as React from 'react';

import ComponentState from '../../types/ComponentState';
import ComponentContext from '../types/ComponentContext';
import ExternalLink from './ExternalLink';
import LabelButton from './LabelButton';
import { context } from '../contexts/componentContext';

const renderStateLabel = (state: ComponentState) => {
  switch (state) {
    case ComponentState.Stopped:
      return 'NOT RUNNING';
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
  }
};

const shouldRenderUseCacheButton = (state: number) =>
  state === ComponentState.Stopped || state === ComponentState.Running;

const shouldRenderBuildButton = (state: number) => state === ComponentState.Running;

const shouldRenderInstallButton = (state: number) =>
  state === ComponentState.Stopped || state === ComponentState.Running;

const ComponentActions = ({ editors }: { editors: string[] }) => {
  const componentContext: ComponentContext = React.useContext(context);
  const { onInstall, onBuild, onOpenInCode, onSetUseCache } = componentContext.handlers;
  const { displayName, state, name, useCache } = componentContext.component;

  return (
    <div className="container">
      <div className="header">
        <h2 className="name">{displayName}</h2>
        <p className="state-label">{renderStateLabel(state)}</p>
      </div>
      <div className="actions">
        {shouldRenderUseCacheButton(state) && (
          <div className="item-wrapper">
            <LabelButton
              backgroundColor={useCache ? '#c9ffc9' : 'transparent'}
              className={useCache ? 'no-use-cache-button' : 'use-cache-button'}
              label="Cache"
              onClick={() => onSetUseCache(name, !useCache)}
            />
          </div>
        )}
        {shouldRenderBuildButton(state) && (
          <div className="item-wrapper">
            <LabelButton className="build-button" label="Build" onClick={() => onBuild(name)} />
          </div>
        )}
        {shouldRenderInstallButton(state) && (
          <div className="item-wrapper">
            <LabelButton className="install-button" label="Reinstall" onClick={() => onInstall(name)} />
          </div>
        )}
        {editors.indexOf('code') !== -1 ? (
          <div className="item-wrapper" key="vs-code-button">
            <LabelButton
              className="vs-code-button"
              label="VS Code"
              image="/image/icon/vscode-logo.svg"
              onClick={() => onOpenInCode(name)}
            />
          </div>
        ) : null}
        <div className="item-wrapper">
          <ExternalLink
            label="Dependency Graph"
            link={`https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/${displayName}`}
            black
          />
        </div>
        <div className="item-wrapper">
          <ExternalLink label="GitHub" link={`https://github.com/bbc/morph-modules/tree/master/${displayName}`} black />
        </div>
      </div>
    </div>
  );
};

export default ComponentActions;
