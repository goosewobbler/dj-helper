import { assign } from 'lodash/fp';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ComponentData from '../../types/ComponentData';
import Theme from '../../types/Theme';
import { favouriteComponent, startComponent, stopComponent, updateAndSelectComponent } from '../actions/components';
import ComponentList from '../components/ComponentList';
import findOrderedSearchResults from '../helpers/resultsHelper';
import IComponentListItemData from '../types/IComponentListItemData';
import IState from '../types/IState';

const getSortedComponents = (components: ComponentData[]): ComponentData[] => {
  return components.sort((mA: ComponentData, mB: ComponentData) => {
    if (mA.favorite && !mB.favorite) {
      return -1;
    } else if (!mA.favorite && mB.favorite) {
      return 1;
    }
    return mA.name.localeCompare(mB.name);
  });
};

const getFilteredComponents = (components: ComponentData[], filter: string): ComponentData[] => {
  const componentsWithAlternatives = components.map(component =>
    assign(component, {
      alternatives: [component.displayName.replace(/-/g, ' ')],
    }),
  );
  const results = findOrderedSearchResults(componentsWithAlternatives, filter);

  if (results.length > 50) {
    return results.slice(0, 50);
  }

  return results;
};

const getComponents = (components: ComponentData[], filter: string) => {
  if (filter) {
    return getFilteredComponents(components, filter);
  }
  return getSortedComponents(components);
};

const getUrl = (component: ComponentData) =>
  `${component.url}${Array.isArray(component.history) && component.history.length > 0 ? component.history[0] : ''}`;

const getListItemComponents = (
  components: ComponentData[],
  filter: string,
  theme: Theme,
): IComponentListItemData[] => {
  const componentsList: ComponentData[] = getComponents(components, filter);
  return componentsList.map(componentListItem => ({
    displayName: componentListItem.displayName,
    favourite: componentListItem.favorite,
    highlighted: componentListItem.highlighted,
    name: componentListItem.name,
    state: componentListItem.state,
    theme,
    url: getUrl(componentListItem),
  }));
};

const componentsSelector = (state: IState) => state.components;
const filterSelector = (state: IState) => state.ui.filter;
const themeSelector = (state: IState) => state.ui.theme;

const filteredComponentsSelector = createSelector(
  componentsSelector,
  filterSelector,
  themeSelector,
  getListItemComponents,
);

const mapStateToProps = (state: IState) => ({
  components: filteredComponentsSelector(state),
  selectedComponent: state.ui.selectedComponent,
  theme: state.ui.theme,
});

const mapDispatchToProps = (dispatch: any) => ({
  onFavouriteComponent: (name: string, favorite: boolean) => dispatch(favouriteComponent(name, favorite)),
  onSelectComponent: (name: string) => dispatch(updateAndSelectComponent(name)),
  onStartComponent: (name: string) => dispatch(startComponent(name)),
  onStopComponent: (name: string) => dispatch(stopComponent(name)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentList as any);

export default Container;
