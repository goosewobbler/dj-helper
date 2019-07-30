import * as React from 'react';

import ExternalLink from '../ui/ExternalLink';
import VSCodeIcon from '../ui/icon/VSCodeIcon';
import LabelButton from '../ui/LabelButton';

import { ComponentState, ComponentData } from '../../common/types';

interface ComponentActionsProps {
  component: ComponentData;
  editors: string[];
  onClone(name: string): any;
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

const renderRendererLabel = (props: ComponentActionsProps) => {
  return (
    <p className="renderer-label">
      Node version: 
      {' '}
      {props.component.rendererType}
    </p>
  );
};

const renderUseCacheButton = (props: ComponentActionsProps) => {
  if (props.component.state === ComponentState.Stopped || props.component.state === ComponentState.Running) {
    return (
      <div className="wrapper">
        <LabelButton
          className={props.component.useCache ? 'no-use-cache-button' : 'use-cache-button'}
          label="Cache"
          onClick={() => props.onSetUseCache(props.component.name, !props.component.useCache)}
        />
      </div>
    );
  }
  return null;
};

const renderBuildButton = (props: ComponentActionsProps) => {
  if (props.component.state === ComponentState.Running) {
    return (
      <div className="wrapper">
        <LabelButton
          className="build-button"
          label="Build"
          onClick={() => props.onBuild(props.component.name)}
        />
      </div>
    );
  }
  return null;
};

const renderInstallButton = (props: ComponentActionsProps) => {
  if (props.component.state === ComponentState.Stopped || props.component.state === ComponentState.Running) {
    return (
      <div className="wrapper">
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

const renderCloneButton = (props: ComponentActionsProps) => {
  return (
    <div className="wrapper">
      <LabelButton
        className="clone-button"
        label="Clone"
        onClick={() => props.onClone(props.component.name)}
      />
    </div>
  );
};

const ComponentActions = (props: ComponentActionsProps) => (
  <div>
    <div className="header">
      <h2>{props.component.displayName}</h2>
      {renderRendererLabel(props)}
      <p className="state-label">
        {renderStateLabel(props.component.state)}
      </p>
    </div>
    <div className="actions">
      {renderUseCacheButton(props)}
      {renderBuildButton(props)}
      {renderInstallButton(props)}
      {renderCloneButton(props)}
      {props.editors.indexOf('code') !== -1 ? (
        <div className="wrapper" key="vs-code-button">
          <LabelButton
            className="vs-code-button"
            label="VS Code"
            image={<VSCodeIcon />}
            onClick={() => props.onOpenInCode(props.component.name)}
          />
        </div>
      ) : null}
      <div className="wrapper">
        <ExternalLink
          label="Dependency Graph"
          link={`https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/${props.component.displayName}`}
          black
        />
      </div>
      <div className="wrapper">
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
