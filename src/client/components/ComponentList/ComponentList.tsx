import * as React from 'react';

import ScrollList from './ScrollList';
import { ComponentListItem } from './ComponentListItem';
import { ComponentState } from '../../../common/types';

interface ComponentListProps {
  components: ComponentListItemData[];
  selectedComponent?: string;
  onSelectComponent(name: string): any;
  onFavouriteComponent(name: string, favourite: boolean): any;
  onStartComponent(name: string): any;
  onStopComponent(name: string): any;
}

interface ComponentListItemData {
  name: string;
  displayName: string;
  highlighted?: boolean;
  url: string;
  favourite: boolean;
  state: ComponentState;
}

class ComponentList extends React.PureComponent<ComponentListProps> {
  public constructor(props: ComponentListProps) {
    super(props);

    this.renderListItem = this.renderListItem.bind(this);
  }

  private renderListItem(index: number, key: string) {
    const {
      components,
      selectedComponent,
      onSelectComponent,
      onFavouriteComponent,
      onStartComponent,
      onStopComponent,
    } = this.props;
    const component = components[index];

    return (
      <ComponentListItem
        key={key}
        name={component.name}
        displayName={component.displayName}
        highlighted={component.highlighted}
        url={component.url}
        state={component.state}
        favourite={component.favourite}
        selected={component.name === selectedComponent}
        onClick={onSelectComponent}
        onFavourite={onFavouriteComponent}
        onStart={onStartComponent}
        onStop={onStopComponent}
      />
    );
  }

  public render() {
    const { components, selectedComponent } = this.props;
    const selectedIndex = components.findIndex(component => component.name === selectedComponent);
    return (
      <ScrollList
        length={components.length}
        selectedID={selectedComponent}
        selectedIndex={selectedIndex}
        renderListItem={this.renderListItem}
      />
    );
  }
}

export { ComponentList, ComponentListItemData };
