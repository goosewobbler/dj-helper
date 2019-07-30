import * as React from 'react';
import classNames from 'classnames';
import { gte, lt, valid } from 'semver';

import { context, ComponentContext } from '../contexts/componentContext';

const promotionInProgressText = (environment: string) => (environment === 'int' ? 'Bumping' : 'Promoting');
const promotionActionText = (environment: string) => (environment === 'int' ? 'Bump' : 'Promote');

const PromoteButton = ({
  environment,
  buildInProgress,
  action,
}: {
  environment: string;
  buildInProgress: { [key: string]: boolean };
  action: any;
}) => (
  <button type="button" className={classNames(['promote-button', environment])} onClick={action}>
    {buildInProgress[environment] ? (
      <span>{promotionInProgressText(environment)}</span>
    ) : (
      promotionActionText(environment)
    )}
  </button>
);

const Environment = ({ version, label, isCurrent }: { label: string; version: string; isCurrent: boolean }) => {
  if (version === null) {
    return (
      <div className="environment-loading">
        <img src="/image/icon/gel-icon-loading-white.svg" alt="loading..." />
      </div>
    );
  }

  return (
    <div className={classNames(['environment-version', isCurrent && 'current'])}>
      <p className="version-label">{version || 'N/A'}</p>
      <p className="environment-label">{label}</p>
    </div>
  );
};

const promotionFailureElement = (failure: string) => {
  if (!failure.startsWith('http')) {
    return failure;
  }

  return (
    <a className="failure" href={failure} target="_blank" rel="noopener noreferrer">
      {failure}
    </a>
  );
};

const shouldRenderPromoteButton = (versions: any, buildInProgress: any, fromEnv: string, toEnv: string) => {
  if (!versions[fromEnv] || versions[toEnv] === null || buildInProgress[toEnv]) {
    return false;
  }
  if (!versions[toEnv]) {
    return true;
  }

  return lt(versions[toEnv], versions[fromEnv]);
};

const parseVersions = ({
  local = null,
  int = null,
  test = null,
  live = null,
}: {
  local: string;
  int: string;
  test: string;
  live: string;
}) => ({
  local: valid(local),
  int: int === '' ? int : valid(int),
  test: test === '' ? test : valid(test),
  live: live === '' ? live : valid(live),
});

const ComponentVersions = () => {
  const componentContext: ComponentContext = React.useContext(context);
  const { onBumpComponent, onPromoteComponent } = componentContext.handlers;
  const { versions, promoting, name, promotionFailure } = componentContext.component;
  const parsedVersions: { local: string; int: string; test: string; live: string } = parseVersions(versions);
  const { local, int, test, live } = parsedVersions;

  const buildInProgress = {
    int: promoting === 'int',
    test: promoting === 'test',
    live: promoting === 'live',
  };

  const localUpToDate = !local || !int || gte(local, int);
  const latestVersion = localUpToDate ? local : int;
  const intUpToDate = !!(int && local && gte(int, local));
  const testUpToDate = !!(latestVersion && test && gte(test, latestVersion));
  const liveUpToDate = !!(latestVersion && live && gte(live, latestVersion));

  return (
    <div>
      {promotionFailure && (
        <p className="promotion-failure">
          <span role="img" aria-label="Anguished face">
            😧
          </span>
          &nbsp; Promotion failed:&nbsp;
          {promotionFailureElement(promotionFailure)}
        </p>
      )}
      <div className="environment">
        <Environment label="LOCAL" version={local} isCurrent={localUpToDate} />
        <div className="connector">
          <PromoteButton
            environment="int"
            buildInProgress={buildInProgress}
            action={() => onBumpComponent(name, 'patch')}
          />
        </div>
        <Environment label="INT" version={int} isCurrent={intUpToDate} />
        <div className="connector">
          {shouldRenderPromoteButton(versions, buildInProgress, 'int', 'test') && (
            <PromoteButton
              environment="test"
              buildInProgress={buildInProgress}
              action={() => onPromoteComponent(name, 'test')}
            />
          )}
        </div>
        <Environment label="TEST" version={test} isCurrent={testUpToDate} />
        <div className="connector">
          {shouldRenderPromoteButton(versions, buildInProgress, 'test', 'live') && (
            <PromoteButton
              environment="live"
              buildInProgress={buildInProgress}
              action={() => onPromoteComponent(name, 'live')}
            />
          )}
        </div>
        <Environment label="LIVE" version={live} isCurrent={liveUpToDate} />
      </div>
    </div>
  );
};

export default ComponentVersions;
