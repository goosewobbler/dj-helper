import * as React from 'react';

import ComponentDetailsSection from '../ui/ComponentDetailsSection';
import ExternalLink from '../ui/ExternalLink';
import Graph from '../ui/Graph';
import HeaderLinks from '../ui/HeaderLinks';
import Tabs from '../ui/Tabs';
import ComponentData from '../../types/ComponentData';
import ComponentDependency from '../../types/ComponentDependency';
import ComponentHandlers from '../types/ComponentHandlers';
import ComponentActions from './ComponentActions';
import ComponentDependencyListItem from './ComponentDependencyListItem';
import ComponentVersions from './ComponentVersions';
import { ComponentContext, ComponentContextProvider } from '../contexts/componentContext';

interface IComponentDetailsProps {
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


  const renderDependencyGraph = (props: IComponentDetailsProps) => {
    return (
      <Graph
        onSelect={props.onSelectComponent}
        theme={props.theme}
        down={true}
        url={`http://localhost:3333/api/component/${props.component.name}/dependency-graph`}
      />
    );
  };
  
  const renderDependendantGraph = (props: IComponentDetailsProps) => {
    return (
      <Graph
        onSelect={props.onSelectComponent}
        theme={props.theme}
        down={false}
        url={`http://localhost:3333/api/component/${props.component.name}/dependant-graph`}
      />
    );
  };
  
  const buildPipelineLink = (rendererType: string) => (env: string) => {
    const jobPrefix = rendererType === '10' ? 'modern-' : '';
    return `https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-${jobPrefix}promote-${env}/`;
  };
  
  const renderPipelineLinks = (props: IComponentDetailsProps) => {
    const buildEnvLink = buildPipelineLink(props.component.rendererType);
    return (
      <HeaderLinks key="links">
        <ExternalLink theme={props.theme} link={buildEnvLink('int')} label="INT Pipeline" black={true} />
        <ExternalLink theme={props.theme} link={buildEnvLink('test')} label="TEST Pipeline" black={true} />
        <ExternalLink theme={props.theme} link={buildEnvLink('live')} label="LIVE Pipeline" black={true} />
      </HeaderLinks>
    );
  };
  

const renderPlaceholder = () => (
  <div className="placeholder">
    <p>No component selected</p>
  </div>
);

const ComponentDetails = ({ component, editors, handlers }: IComponentDetailsProps) => {
  if (!component) {
    return renderPlaceholder();
  }

  const { dependencies, displayName } = component;
  const hasDependencies = Array.isArray(dependencies) && dependencies.length > 0;
  const componentContextValue: ComponentContext = { component, handlers };



  return (
    <Tabs
    headings={['Overview', 'Dependencies', 'Dependants']}
    theme={props.theme}
    buttons={{ render: renderPipelineLinks, props }}
  >
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
    {renderDependencyGraph(props)}
    {renderDependendantGraph(props)}
  </Tabs>
  );
};

export default ComponentDetails;
