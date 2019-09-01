import React, { ReactElement } from 'react';

import ComponentDetailsSection from './ComponentDetailsSection';
import ExternalLink from '../ExternalLink';
import Graph from './Graph';
import Tabs from './Tabs';

import ComponentActions from './ComponentActions';
import ComponentDependencyListItem from './ComponentDependencyListItem';
import ComponentVersions from './ComponentVersions';

import { ComponentData, ComponentDependency } from '../../../common/types';
import { ComponentContext, ComponentContextProvider, ComponentHandlers } from '../../contexts/componentContext';
import { getApiPort } from '../../helpers/apiPortHelper';

interface ComponentDetailsProps {
  component?: ComponentData;
  editors: string[];
  handlers: ComponentHandlers;
}

const renderDetailsSectionEnd = (): ReactElement => (
  <div className="dependencies-heading">
    <h4>Wants</h4>
    <h4>Bundled</h4>
    <h4>Latest</h4>
  </div>
);

const orderDependencies = (dependencies: ComponentDependency[]): ComponentDependency[] =>
  (dependencies || []).sort((a, b): number => a.displayName.localeCompare(b.displayName));

const renderDependencyGraph = (handlers: ComponentHandlers, componentName: string): ReactElement => {
  const apiPort = getApiPort();
  return (
    <Graph
      onSelect={handlers.onSelectComponent}
      down
      url={`http://localhost:${apiPort}/api/component/${componentName}/dependency-graph`}
    />
  );
};

const renderDependendantGraph = (handlers: ComponentHandlers, componentName: string): ReactElement => {
  const apiPort = getApiPort();
  return (
    <Graph
      onSelect={handlers.onSelectComponent}
      down={false}
      url={`http://localhost:${apiPort}/api/component/${componentName}/dependant-graph`}
    />
  );
};

const buildPipelineLink = (rendererType: string): Function => (env: string): string => {
  const jobPrefix = rendererType === '10' ? 'modern-' : '';
  return `https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-${jobPrefix}promote-${env}/`;
};

const renderPipelineLinks = (component: ComponentData): ReactElement => {
  const buildEnvLink = buildPipelineLink(component.rendererType);
  return (
    <div key="links">
      <ExternalLink link={buildEnvLink('int')} label="INT Pipeline" black />
      <ExternalLink link={buildEnvLink('test')} label="TEST Pipeline" black />
      <ExternalLink link={buildEnvLink('live')} label="LIVE Pipeline" black />
    </div>
  );
};

const renderPlaceholder = (): ReactElement => (
  <div className="placeholder">
    <p>No component selected</p>
  </div>
);

const ComponentDetails = ({ component, editors, handlers }: ComponentDetailsProps): ReactElement => {
  if (!component) {
    return renderPlaceholder();
  }

  const { dependencies, displayName } = component;
  const hasDependencies = Array.isArray(dependencies) && dependencies.length > 0;
  const componentContextValue: ComponentContext = { component, handlers };

  return (
    <Tabs
      headings={['Overview', 'Dependencies', 'Dependants']}
      renderButtons={(): ReactElement => renderPipelineLinks(component)}
    >
      <ComponentContextProvider value={componentContextValue}>
        <div className="details">
          <div className="actions">
            <ComponentActions editors={editors} component={component} handlers={handlers} />
          </div>
          <ComponentDetailsSection label="Versions">
            <ComponentVersions />
          </ComponentDetailsSection>
          {hasDependencies && (
            <ComponentDetailsSection label="Dependencies" end={renderDetailsSectionEnd()}>
              <ul>
                {orderDependencies(dependencies).map(
                  (dependency: ComponentDependency): ReactElement => (
                    <ComponentDependencyListItem dependency={dependency} />
                  ),
                )}
              </ul>
            </ComponentDetailsSection>
          )}
        </div>
      </ComponentContextProvider>
      {renderDependencyGraph(handlers, displayName)}
      {renderDependendantGraph(handlers, displayName)}
    </Tabs>
  );
};

export default ComponentDetails;
