import * as React from 'react';

import ComponentState from '../../types/ComponentState';
import ComponentData from '../../types/ComponentData';
import Theme from '../../types/Theme';
import ExternalLink from '../ui/ExternalLink';
import VSCodeIcon from '../ui/icon/VSCodeIcon';
import LabelButton from '../ui/LabelButton';

interface IComponentActionsProps {
  theme: Theme;
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

const renderRendererLabel = (props: IComponentActionsProps) => {
  return (
    <p className="renderer-label">
      Node version: {props.component.rendererType}
    </p>
  );
};

const renderUseCacheButton = (props: IComponentActionsProps) => {
  if (props.component.state === ComponentState.Stopped || props.component.state === ComponentState.Running) {
    return (
      <div className="wrapper">
        <LabelButton
          theme={props.theme}
          backgroundColor={props.component.useCache ? props.theme.highlightColour : null}
          color={props.component.useCache ? props.theme.secondaryTextColour : null}
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
      <div className="wrapper">
        <LabelButton
          theme={props.theme}
          className="build-button"
          label="Build"
          onClick={() => props.onBuild(props.component.name)}
        />
      </div>
    );
  }
  return null;
};

const renderInstallButton = (props: IComponentActionsProps) => {
  if (props.component.state === ComponentState.Stopped || props.component.state === ComponentState.Running) {
    return (
      <div className="wrapper">
        <LabelButton
          theme={props.theme}
          className="install-button"
          label="Reinstall"
          onClick={() => props.onInstall(props.component.name)}
        />
      </div>
    );
  }
  return null;
};

const renderCloneButton = (props: IComponentActionsProps) => {
  return (
    <div className="wrapper">
      <LabelButton
        theme={props.theme}
        className="clone-button"
        label="Clone"
        onClick={() => props.onClone(props.component.name)}
      />
    </div>
  );
};

const ComponentActions = (props: IComponentActionsProps) => (
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
            theme={props.theme}
            className="vs-code-button"
            label="VS Code"
            image={<VSCodeIcon />}
            onClick={() => props.onOpenInCode(props.component.name)}
          />
        </div>
      ) : null}
      <div className="wrapper">
        <ExternalLink
          theme={props.theme}
          label="Dependency Graph"
          link={`https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/${props.component.displayName}`}
          black={true}
        />
      </div>
      <div className="wrapper">
        <ExternalLink
          theme={props.theme}
          label="GitHub"
          link={`https://github.com/bbc/morph-modules/tree/master/${props.component.displayName}`}
          black={true}
        />
      </div>
    </div>
  </div>
);

export default ComponentActions;
