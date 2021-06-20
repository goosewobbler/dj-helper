import * as React from 'react';
import classNames from 'classnames';
import gte from 'semver/functions/gte';
import lt from 'semver/functions/lt';
import valid from 'semver/functions/valid';

import { getComponentContext } from '../../../contexts/componentContext';
import Spacer from '../../Spacer';
import { Versions } from '../../../../common/types';
import VersionBox from '../VersionBox';

const promotionInProgressText = (environment: string): string => (environment === 'int' ? 'Bumping' : 'Promoting');
const promotionActionText = (environment: string): string => (environment === 'int' ? 'Bump' : 'Promote');

const PromoteButton = ({
  environment,
  buildInProgress,
  action,
}: {
  environment: string;
  buildInProgress: { [key: string]: boolean };
  action(): void;
}): React.ReactElement => (
  <button type="button" className={classNames(['promote-button', environment])} onClick={action}>
    {buildInProgress[environment] ? (
      <span>{promotionInProgressText(environment)}</span>
    ) : (
      promotionActionText(environment)
    )}
  </button>
);

const Environment = ({
  version,
  label,
  isCurrent,
}: {
  label: string;
  version: string | null;
  isCurrent: boolean;
}): React.ReactElement => {
  if (version === null) {
    return (
      <div className="environment-loading">
        <img src="/image/icon/gel-icon-loading-white.svg" alt="loading..." />
      </div>
    );
  }

  return (
    <div className={classNames(['environment-version', isCurrent && 'current'])}>
      <VersionBox version={version} width="w-16" height="h-16" current={isCurrent}>
        <>
          <p className="version-label">{version || 'N/A'}</p>
          <Spacer space={4} />
          <p className="environment-label">{label}</p>
        </>
      </VersionBox>
    </div>
  );
};

const promotionFailureElement = (failure: string): React.ReactElement | string => {
  if (!failure.startsWith('http')) {
    return failure;
  }

  return (
    <a className="failure" href={failure} target="_blank" rel="noopener noreferrer">
      {failure}
    </a>
  );
};

const shouldRenderPromoteButton = (
  versions: Versions,
  buildInProgress: { [Key: string]: boolean },
  fromEnv: string,
  toEnv: string,
): boolean => {
  if (!versions[fromEnv] || versions[toEnv] === null || buildInProgress[toEnv]) {
    return false;
  }
  if (!versions[toEnv]) {
    return true;
  }

  return lt(versions[toEnv]!, versions[fromEnv]!); // TODO: Tech debt
};

const parseVersions = ({ local = null, int = null, test = null, live = null }: Versions): Versions => ({
  local: valid(local),
  int: int === '' ? int : valid(int),
  test: test === '' ? test : valid(test),
  live: live === '' ? live : valid(live),
});

const ComponentVersions = (): React.ReactElement => {
  const {
    component: { versions, promoting, name, promotionFailure },
    handlers: { bumpComponent, promoteComponent },
  } = getComponentContext();
  const parsedVersions = parseVersions(versions!); // TODO: Tech debt
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
        <>
          <p className="promotion-failure">
            <span role="img" aria-label="anguished face">
              😧
            </span>
            &nbsp; Promotion failed:&nbsp;
            {promotionFailureElement(promotionFailure)}
          </p>
          <Spacer space={16} />
        </>
      )}
      <div className="environment">
        <Environment label="LOCAL" version={local} isCurrent={localUpToDate} />
        <div className="connector">
          <PromoteButton
            environment="int"
            buildInProgress={buildInProgress}
            action={(): void => bumpComponent(name, 'patch')}
          />
        </div>
        <Environment label="INT" version={int} isCurrent={intUpToDate} />
        <div className="connector">
          {shouldRenderPromoteButton(versions!, buildInProgress, 'int', 'test') && ( // TODO: Tech debt
            <PromoteButton
              environment="test"
              buildInProgress={buildInProgress}
              action={(): void => promoteComponent(name, 'test')}
            />
          )}
        </div>
        <Environment label="TEST" version={test} isCurrent={testUpToDate} />
        <div className="connector">
          {shouldRenderPromoteButton(versions!, buildInProgress, 'test', 'live') && ( // TODO: Tech debt
            <PromoteButton
              environment="live"
              buildInProgress={buildInProgress}
              action={(): void => promoteComponent(name, 'live')}
            />
          )}
        </div>
        <Environment label="LIVE" version={live} isCurrent={liveUpToDate} />
      </div>
    </div>
  );
};

export default ComponentVersions;
