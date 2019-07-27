import { startsWith } from 'lodash/fp';
import * as React from 'react';
import { gte, lt, valid } from 'semver';

import IComponentData from '../../types/IComponentData';

const BumpConnector = (props: { bumping?: boolean; bump?(): any }) => {
  const onClick = props.bumping ? null : props.bump;
  return (
    <div className="connector">
      <button className="bump-button" onClick={onClick}>
        {props.bumping ? <span>Bumping</span> : 'Bump'}
      </button>
    </div>
  );
};

const PromoteConnector = (props: { environment?: string; promoting?: boolean; promote?(): any }) => {
  if (props.promote) {
    const onClick = props.promoting ? null : props.promote;
    return (
      <div className="connector">
        <button className="promote-button" data-test={props.environment} onClick={onClick}>
          {props.promoting ? <span>Promoting</span> : 'Promote'}
        </button>
      </div>
    );
  }

  return <div className="connector" />;
};

interface IEnvironmentProps {
  label: string;
  version: string;
  current: boolean;
}

const Environment = (props: IEnvironmentProps) => {
  if (props.version === null) {
    return (
      <div className="environment-loading">
        <img src="/image/icon/gel-icon-loading-white.svg" />
      </div>
    );
  }

  return (
    <div data-test={props.current} className="environment-version">
      <p className="version-label">{props.version || 'N/A'}</p>
      <p className="environment-label">{props.label}</p>
    </div>
  );
};

interface IComponentVersionsProps {
  component: IComponentData;
  onBumpComponent?(name: string, type: string): any;
  onPromoteComponent?(name: string, environment: string): any;
}

const ComponentVersions = (props: IComponentVersionsProps) => {
  const rawVersions = props.component.versions || { local: null, int: null, test: null, live: null };
  const versions = {
    int: rawVersions.int === '' ? rawVersions.int : valid(rawVersions.int),
    live: rawVersions.live === '' ? rawVersions.live : valid(rawVersions.live),
    local: valid(rawVersions.local),
    test: rawVersions.test === '' ? rawVersions.test : valid(rawVersions.test),
  };

  const localUpToDate = !versions.local || !versions.int || gte(versions.local, versions.int);
  const latestVersion = localUpToDate ? versions.local : versions.int;
  const intCurrent = Boolean(versions.int && versions.local && gte(versions.int, versions.local));
  const testCurrent = Boolean(latestVersion && versions.test && gte(versions.test, latestVersion));
  const liveCurrent = Boolean(latestVersion && versions.live && gte(versions.live, latestVersion));
  const bumping = props.component.promoting === 'int';
  const promotingINT = props.component.promoting === 'test';
  const promotingTEST = props.component.promoting === 'live';
  const showPromoteINT =
    versions.int && versions.test !== null && !promotingTEST && (!versions.test || lt(versions.test, versions.int));
  const showPromoteTEST =
    versions.test && versions.live !== null && !promotingINT && (!versions.live || lt(versions.live, versions.test));
  const bumpAction = () => props.onBumpComponent(props.component.name, 'patch');
  const promoteToTestAction = showPromoteINT ? () => props.onPromoteComponent(props.component.name, 'test') : null;
  const promoteToLiveAction = showPromoteTEST ? () => props.onPromoteComponent(props.component.name, 'live') : null;

  const failure = props.component.promotionFailure;

  const failureElement = startsWith('http', failure) ? (
    <a className="failure" href={failure} target="_blank">
      {failure}
    </a>
  ) : (
    failure
  );

  const promotionFailure = failure ? (
    <p className="promotion-failure">
      <span role="img" aria-label="Anguished face">
        😧
      </span>
      &nbsp; Promotion failed:&nbsp;
      {failureElement}
    </p>
  ) : null;

  return (
    <div>
      {promotionFailure}
      <div className="environment">
        <Environment label="LOCAL" version={versions.local} current={localUpToDate} />
        <BumpConnector bumping={bumping} bump={bumpAction} />
        <Environment label="INT" version={versions.int} current={intCurrent} />
        <PromoteConnector environment="test" promoting={promotingINT} promote={promoteToTestAction} />
        <Environment label="TEST" version={versions.test} current={testCurrent} />
        <PromoteConnector environment="live" promoting={promotingTEST} promote={promoteToLiveAction} />
        <Environment label="LIVE" version={versions.live} current={liveCurrent} />
      </div>
    </div>
  );
};

export default ComponentVersions;
