import { assign } from 'lodash/fp';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { favouriteComponent, startComponent, stopComponent, updateAndSelectComponent } from '../../actions/components';

import findOrderedSearchResults from '../../helpers/resultsHelper';
import { ComponentList, ComponentListItemData } from './ComponentList';
import { ComponentData, AppState } from '../../../common/types';

const getSortedComponents = (components: ComponentData[]): ComponentData[] => {
  return components.sort((mA: ComponentData, mB: ComponentData): number => {
    if (mA.favourite && !mB.favourite) {
      return -1;
    }
    if (!mA.favourite && mB.favourite) {
      return 1;
    }
    return mA.name.localeCompare(mB.name);
  });
};

const getFilteredComponents = (components: ComponentData[], filter: string): ComponentData[] => {
  const componentsWithAlternatives = components.map(
    (component): ComponentData =>
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

const getComponents = (components: ComponentData[], filter: string): ComponentData[] => {
  if (filter) {
    return getFilteredComponents(components, filter);
  }
  return getSortedComponents(components);
};

const getUrl = (component: ComponentData): string =>
  `${component.url}${Array.isArray(component.history) && component.history.length > 0 ? component.history[0] : ''}`;

const getListItemComponents = (components: ComponentData[], filter: string): ComponentListItemData[] => {
  const componentsList: ComponentData[] = getComponents(components, filter);
  return componentsList.map(
    (componentListItem): ComponentListItemData => ({
      displayName: componentListItem.displayName,
      favourite: componentListItem.favourite,
      highlighted: componentListItem.highlighted,
      name: componentListItem.name,
      state: componentListItem.state,
      url: getUrl(componentListItem),
    }),
  );
};

const componentsSelector = (state: AppState): ComponentData[] => state.components;
const filterSelector = (state: AppState): string => state.ui.filter;

const filteredComponentsSelector = createSelector(
  componentsSelector,
  filterSelector,
  getListItemComponents,
);

const mapStateToProps = (state: AppState): {} => ({
  components: filteredComponentsSelector(state),
  selectedComponent: state.ui.selectedComponent,
});

const mapDispatchToProps = (dispatch: any): {} => ({
  onFavouriteComponent: (name: string, favourite: boolean) => dispatch(favouriteComponent(name, favourite)),
  onSelectComponent: (name: string) => dispatch(updateAndSelectComponent(name)),
  onStartComponent: (name: string) => dispatch(startComponent(name)),
  onStopComponent: (name: string) => dispatch(stopComponent(name)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentList as any);

export default Container;
