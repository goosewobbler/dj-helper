import * as React from 'react';

import ComponentState from '../../types/ComponentState';
import IComponentData from '../../types/IComponentData';
import ExternalLink from './ExternalLink';
import LabelButton from './LabelButton';

interface IComponentActionsProps {
  component: IComponentData;
  editors: string[];
  onSetUseCache(name: string, value: boolean): any;
  onBuild(name: string): any;
  onInstall(name: string): any;
  onOpenInCode(name: string): any;
}

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

const renderUseCacheButton = (props: IComponentActionsProps) => {
  if (props.component.state === ComponentState.Stopped || props.component.state === ComponentState.Running) {
    return (
      <div className="item-wrapper">
        <LabelButton
          backgroundColor={props.component.useCache ? '#c9ffc9' : 'transparent'}
          className={props.component.useCache ? 'no-use-cache-button' : 'use-cache-button'}
          label="Cache"
          onClick={() => props.onSetUseCache(props.component.name, !props.component.useCache)}
        />
      </div>
    );
  }
  return null;
};

const renderBuildButton = (props: IComponentActionsProps) => {
  if (props.component.state === ComponentState.Running) {
    return (
      <div className="item-wrapper">
        <LabelButton className="build-button" label="Build" onClick={() => props.onBuild(props.component.name)} />
      </div>
    );
  }
  return null;
};

const renderInstallButton = (props: IComponentActionsProps) => {
  if (props.component.state === ComponentState.Stopped || props.component.state === ComponentState.Running) {
    return (
      <div className="item-wrapper">
        <LabelButton
          className="install-button"
          label="Reinstall"
          onClick={() => props.onInstall(props.component.name)}
        />
      </div>
    );
  }
  return null;
};

const ComponentActions = (props: IComponentActionsProps) => (
  <div className="container">
    <div className="header">
      <h2 className="name">{props.component.displayName}</h2>
      <p className="state-label">{renderStateLabel(props.component.state)}</p>
    </div>
    <div className="actions">
      {renderUseCacheButton(props)}
      {renderBuildButton(props)}
      {renderInstallButton(props)}
      {props.editors.indexOf('code') !== -1 ? (
        <div className="item-wrapper" key="vs-code-button">
          <LabelButton
            className="vs-code-button"
            label="VS Code"
            image="/image/icon/vscode-logo.svg"
            onClick={() => props.onOpenInCode(props.component.name)}
          />
        </div>
      ) : null}
      <div className="item-wrapper">
        <ExternalLink
          label="Dependency Graph"
          link={`https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/${props.component.displayName}`}
          black
        />
      </div>
      <div className="item-wrapper">
        <ExternalLink
          label="GitHub"
          link={`https://github.com/bbc/morph-modules/tree/master/${props.component.displayName}`}
          black
        />
      </div>
    </div>
  </div>
);

export default ComponentActions;
