import React, { ReactElement } from 'react';

import ExternalLink from '../../ExternalLink';
import VSCodeIcon from '../VSCodeIcon';
import LabelButton from '../../LabelButton';

import { ComponentState } from '../../../../common/types';
import Spacer from '../../Spacer';
import { getComponentContext } from '../../../contexts/componentContext';

type ComponentActionsProps = {
  editors: string[];
};

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

export const ComponentActions = (props: ComponentActionsProps): ReactElement => {
  const { editors } = props;
  const {
    component: { displayName, state, name, useCache, rendererType },
    handlers: { openInCode, showCloneComponentDialog, installComponent, buildComponent, setUseCacheOnComponent },
  } = getComponentContext();
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
        {shouldDisplayUseCacheButton &&
          renderUseCacheButton((): void => setUseCacheOnComponent(name, !useCache), useCache)}
        {shouldDisplayBuildButton && renderBuildButton((): void => buildComponent(name))}
        {shouldDisplayInstallButton && renderInstallButton((): void => installComponent(name))}
        {renderCloneButton((): void => showCloneComponentDialog(name))}
        {editors.includes('code') ? (
          <div className="flex mt-2 ml-2 wrapper " key="vs-code-button">
            <LabelButton
              className="vs-code-button"
              label="VS Code"
              image={<VSCodeIcon />}
              onClick={(): void => openInCode(name)}
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
