import * as React from 'react';

import IComponentListItemProps from '../types/IComponentListItemData';
import ScrollList from '../ui/ScrollList';
import ComponentListItem from './ComponentListItem';

interface IComponentListProps {
  components: IComponentListItemProps[];
  selectedComponent?: string;
  onSelectComponent(name: string): any;
  onFavouriteComponent(name: string, favorite: boolean): any;
  onStartComponent(name: string): any;
  onStopComponent(name: string): any;
}

class ComponentList extends React.PureComponent<IComponentListProps> {
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
        name={component.name}
        displayName={component.displayName}
        highlighted={component.highlighted}
        url={component.url}
        state={component.state}
        favourite={component.favourite}
        selected={component.name === this.props.selectedComponent}
        onClick={this.props.onSelectComponent}
        onFavourite={this.props.onFavouriteComponent}
        onStart={this.props.onStartComponent}
        onStop={this.props.onStopComponent}
      />
    );
  }
}

export default ComponentList;
