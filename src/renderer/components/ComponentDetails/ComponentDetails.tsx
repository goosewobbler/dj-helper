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
import Spacer from '../Spacer';

interface ComponentDetailsProps {
  component?: ComponentData | null;
  editors: string[];
  handlers: ComponentHandlers;
}

const renderDetailsSectionEnd = (): ReactElement => {
  const dependenciesHeadingClassNames = 'text-primary-text flex-shrink-0 font-normal w-16 text-base';
  return (
    <div className="flex pr-8 text-center dependencies-heading">
      <h4 className={dependenciesHeadingClassNames}>Wants</h4>
      <Spacer />
      <h4 className={dependenciesHeadingClassNames}>Bundled</h4>
      <Spacer />
      <h4 className={dependenciesHeadingClassNames}>Latest</h4>
    </div>
  );
};

const orderDependencies = (dependencies: ComponentDependency[]): ComponentDependency[] =>
  (dependencies || []).sort((a, b): number => a.displayName.localeCompare(b.displayName));

const buildPipelineLink = (rendererType: string): Function => (env: string): string => {
  const jobPrefix = rendererType === '10' ? 'modern-' : '';
  return `https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-${jobPrefix}promote-${env}/`;
};

const renderPipelineLinks = (component: ComponentData): ReactElement => {
  const buildEnvLink = buildPipelineLink(component.rendererType);
  return (
    <div className="flex flex-shrink-0 h-10 mr-5" key="links">
      <ExternalLink link={buildEnvLink('int')} label="INT Pipeline" />
      <Spacer />
      <ExternalLink link={buildEnvLink('test')} label="TEST Pipeline" />
      <Spacer />
      <ExternalLink link={buildEnvLink('live')} label="LIVE Pipeline" />
    </div>
  );
};

const renderPlaceholder = (): ReactElement => (
  <div className="flex items-center justify-center flex-grow placeholder text-primary-text">
    <p>No component selected</p>
  </div>
);

const renderDependencies = (dependencies: ComponentDependency[]): ReactElement => (
  <ComponentDetailsSection label="Dependencies" end={renderDetailsSectionEnd()} grow>
    <ul>
      {orderDependencies(dependencies).map(
        (dependency: ComponentDependency): ReactElement => (
          <ComponentDependencyListItem key={dependency.name} dependency={dependency} />
        ),
      )}
    </ul>
  </ComponentDetailsSection>
);

const ComponentDetails = ({ component, editors, handlers }: ComponentDetailsProps): ReactElement => {
  if (!component) {
    return renderPlaceholder();
  }

  const { dependencies, displayName } = component;
  const hasDependencies = Array.isArray(dependencies) && dependencies.length > 0;
  const componentContextValue: ComponentContext = { component, handlers };
  const { onSelectComponent } = handlers;

  return (
    <div className="component-details">
      <div className="flex flex-col flex-grow">
        <Tabs headings={['Overview', 'Dependencies', 'Dependants']} headingChildren={renderPipelineLinks(component)}>
          <ComponentContextProvider value={componentContextValue}>
            <div className="flex flex-col flex-grow details">
              <div className="flex flex-shrink-0 px-2 pt-0 pb-1 actions">
                <ComponentActions editors={editors} component={component} handlers={handlers} />
              </div>
              <ComponentDetailsSection label="Versions">
                <ComponentVersions />
              </ComponentDetailsSection>
              {hasDependencies && renderDependencies(dependencies!)}
            </div>
          </ComponentContextProvider>
          <Graph onSelect={onSelectComponent} componentName={displayName} type="dependency" />
          <Graph onSelect={onSelectComponent} componentName={displayName} type="dependant" />
        </Tabs>
      </div>
    </div>
  );
};

export default ComponentDetails;
