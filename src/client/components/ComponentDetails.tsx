import * as React from 'react';

import ComponentDetailsSection from '../ui/ComponentDetailsSection';
import ExternalLink from '../ui/ExternalLink';
import Graph from '../ui/Graph';
import Tabs from '../ui/Tabs';

import ComponentActions from './ComponentActions';
import ComponentDependencyListItem from './ComponentDependencyListItem';
import ComponentVersions from './ComponentVersions';

import { ComponentData, ComponentDependency } from '../../common/types';
import { ComponentContext, ComponentContextProvider, ComponentHandlers } from '../contexts/componentContext';

interface ComponentDetailsProps {
  component?: ComponentData;
  editors: string[];
  handlers: ComponentHandlers;
}

const renderDetailsSectionEnd = () => (
  <div className="dependencies-heading">
    <h4>Wants</h4>
    <h4>Bundled</h4>
    <h4>Latest</h4>
  </div>
);

const orderDependencies = (dependencies: ComponentDependency[]) =>
  (dependencies || []).sort((a, b) => a.displayName.localeCompare(b.displayName));

const renderDependencyGraph = (handlers: ComponentHandlers) => {
  return (
    <Graph
      onSelect={handlers.onSelectComponent}
      down
      url={`http://localhost:3333/api/component/${props.component.name}/dependency-graph`}
    />
  );
};

const renderDependendantGraph = (handlers: ComponentHandlers) => {
  return (
    <Graph
      onSelect={handlers.onSelectComponent}
      down={false}
      url={`http://localhost:3333/api/component/${props.component.name}/dependant-graph`}
    />
  );
};

const buildPipelineLink = (rendererType: string) => (env: string) => {
  const jobPrefix = rendererType === '10' ? 'modern-' : '';
  return `https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-${jobPrefix}promote-${env}/`;
};

const renderPipelineLinks = (component: ComponentData) => {
  const buildEnvLink = buildPipelineLink(component.rendererType);
  return (
    <div key="links">
      <ExternalLink link={buildEnvLink('int')} label="INT Pipeline" black />
      <ExternalLink link={buildEnvLink('test')} label="TEST Pipeline" black />
      <ExternalLink link={buildEnvLink('live')} label="LIVE Pipeline" black />
    </div>
  );
};

const renderPlaceholder = () => (
  <div className="placeholder">
    <p>No component selected</p>
  </div>
);

const ComponentDetails = ({ component, editors, handlers }: ComponentDetailsProps) => {
  if (!component) {
    return renderPlaceholder();
  }

  const { dependencies, displayName } = component;
  const hasDependencies = Array.isArray(dependencies) && dependencies.length > 0;
  const componentContextValue: ComponentContext = { component, handlers };

  return (
    <Tabs headings={['Overview', 'Dependencies', 'Dependants']} renderButtons={() => renderPipelineLinks(component)}>
      <ComponentContextProvider value={componentContextValue}>
        <div className="details">
          <div className="actions">
            <ComponentActions editors={editors} />
          </div>
          <ComponentDetailsSection label="Versions">
            <ComponentVersions />
          </ComponentDetailsSection>
          {hasDependencies && (
            <ComponentDetailsSection label="Dependencies" grow={1} end={renderDetailsSectionEnd()}>
              <ul>
                {orderDependencies(dependencies).map((dependency: any) => (
                  <ComponentDependencyListItem dependency={dependency} />
                ))}
              </ul>
            </ComponentDetailsSection>
          )}
          }
        </div>
      </ComponentContextProvider>
      {renderDependencyGraph(handlers)}
      {renderDependendantGraph(handlers)}
    </Tabs>
  );
};

export default ComponentDetails;
