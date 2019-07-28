import * as React from 'react';

import ComponentData from '../../types/ComponentData';
import ComponentDependency from '../../types/ComponentDependency';
import ComponentHandlers from '../types/ComponentHandlers';
import ComponentActions from './ComponentActions';
import ComponentDetailsSection from './ComponentDetailsSection';
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
  );
};

export default ComponentDetails;
