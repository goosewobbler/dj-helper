import * as React from 'react';

import ComponentState from '../../types/ComponentState';
import IComponentData from '../../types/IComponentData';
import IComponentDependency from '../../types/IComponentDependency';
import ComponentDependency from './ComponentDependency';

interface IComponentDependenciesProps {
  component: IComponentData;
  onLinkComponent(name: string, dependency: string): any;
  onSelectComponent(name: string): any;
  onUnlinkComponent(name: string, dependency: string): any;
}

const orderDependencies = (dependencies: IComponentDependency[]) =>
  (dependencies || []).sort((a, b) => a.displayName.localeCompare(b.displayName));

const isLinked = (depenencyName: string, component: IComponentData) =>
  component.dependencies.find(d => d.name === depenencyName).linked;

const isLinking = (depenency: string, component: IComponentData) => (component.linking || []).indexOf(depenency) > -1;

const renderDependencies = (props: IComponentDependenciesProps, dependencies: IComponentDependency[]) =>
  dependencies.map(dependency => (
    <li key={dependency.name}>
      <ComponentDependency
        dependency={dependency.displayName}
        latest={dependency.latest}
        has={dependency.has}
        version={dependency.version}
        outdated={dependency.outdated}
        linked={isLinked(dependency.name, props.component)}
        linking={isLinking(dependency.name, props.component)}
        linkableState={props.component.state === ComponentState.Running}
        onClick={() => props.onSelectComponent(dependency.name)}
        onLinkComponent={() => props.onLinkComponent(props.component.name, dependency.name)}
        onUnlinkComponent={() => props.onUnlinkComponent(props.component.name, dependency.name)}
      />
    </li>
  ));

const ComponentDependencies = (props: IComponentDependenciesProps) => (
  <ul>{renderDependencies(props, orderDependencies(props.component.dependencies))}</ul>
);

export default ComponentDependencies;
