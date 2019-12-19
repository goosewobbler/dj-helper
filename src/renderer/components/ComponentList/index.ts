import { assign } from 'lodash/fp';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { createSelector } from 'reselect';
import { favouriteComponent, startComponent, stopComponent, updateAndSelectComponent } from '../../actions/components';
import findOrderedSearchResults from '../../helpers/resultsHelper';
import ComponentList from './ComponentList';
import { ComponentData, AppState, Dispatch } from '../../../common/types';

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

const getListItemComponents = (components: ComponentData[], filter: string): ComponentData[] => {
  const componentsList: ComponentData[] = getComponents(components, filter);
  return componentsList.map(
    (componentListItem): ComponentData => ({
      displayName: componentListItem.displayName,
      favourite: componentListItem.favourite,
      highlighted: componentListItem.highlighted,
      name: componentListItem.name,
      state: componentListItem.state,
      url: getUrl(componentListItem),
      useCache: componentListItem.useCache,
      rendererType: componentListItem.rendererType,
    }),
  );
};

const componentsSelector = (state: AppState): ComponentData[] => state.components;
const filterSelector = (state: AppState): string => state.ui.filter!;

const filteredComponentsSelector = createSelector(componentsSelector, filterSelector, getListItemComponents);

const mapStateToProps = (state: AppState): { components: ComponentData[]; selectedComponent: string } => ({
  components: filteredComponentsSelector(state),
  selectedComponent: state.ui.selectedComponent!,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
): {
  onFavouriteComponent(name: string, favourite: boolean): void;
  onSelectComponent(name: string): void;
  onStartComponent(name: string): void;
  onStopComponent(name: string): void;
} => ({
  onFavouriteComponent: (name: string, favourite: boolean): void => dispatch(favouriteComponent(name, favourite)),
  onSelectComponent: (name: string): AnyAction => dispatch(updateAndSelectComponent(name)),
  onStartComponent: (name: string): void => dispatch(startComponent(name)),
  onStopComponent: (name: string): void => dispatch(stopComponent(name)),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(ComponentList);

export default Container;
