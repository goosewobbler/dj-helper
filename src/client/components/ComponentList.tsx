import * as React from 'react';

import ComponentData from '../../types/ComponentData';
import ScrollList from '../ui/ScrollList';
import ComponentListItem from './ComponentListItem';

interface IComponentListProps {
  components: ComponentData[];
  selectedComponent?: string;
  onSelectComponent(component: ComponentData): null;
  onFavouriteComponent(component: ComponentData, favorite: boolean): null;
  onStartComponent(name: string): null;
  onStopComponent(name: string): null;
}

class ComponentList extends React.Component<IComponentListProps> {
  constructor(props: IComponentListProps) {
    super(props);

    this.renderListItem = this.renderListItem.bind(this);
  }

  public render() {
    const selectedIndex = this.props.components.findIndex(component => component.name === this.props.selectedComponent);
    return (
      <ScrollList
        length={this.props.components.length}
        selectedID={this.props.selectedComponent}
        selectedIndex={selectedIndex}
        renderListItem={this.renderListItem}
      />
    );
  }

  private renderListItem(index: number, key: string) {
    const component = this.props.components[index];
    return (
      <ComponentListItem
        key={key}
        component={component}
        selected={true && component.name === this.props.selectedComponent}
        onClick={() => this.props.onSelectComponent(component)}
        onToggleFavourite={() => this.props.onFavouriteComponent(component, !component.favorite)}
        onStart={() => this.props.onStartComponent(component.name)}
        onStop={() => this.props.onStopComponent(component.name)}
      />
    );
  }
}

const ComponentListAdapter = (props: IComponentListProps) => <ComponentList {...props} />;

export default ComponentListAdapter;
