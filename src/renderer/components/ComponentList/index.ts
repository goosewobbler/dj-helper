import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { favouriteComponent, startComponent, stopComponent, updateAndSelectComponent } from '../../actions/components';
import findOrderedSearchResults from '../../helpers/resultsHelper';
import { ComponentList } from './ComponentList';
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
    ({ ...componentProps }): ComponentData => ({
      alternatives: [componentProps.displayName.replace(/-/g, ' ')],
      ...componentProps,
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

// const getUrl = (component: ComponentData): string =>
//   `${component.url}${Array.isArray(component.history) && component.history.length > 0 ? component.history[0] : ''}`;

const getListItemComponents = (components: ComponentData[], filter: string): ComponentData[] =>
  getComponents(components, filter);
const componentsSelector = (state: AppState): ComponentData[] => state.components;
const filterSelector = (state: AppState): string => state.ui.filter!; // TODO: Tech debt

const filteredComponentsSelector = createSelector(componentsSelector, filterSelector, getListItemComponents);

const mapStateToProps = (state: AppState): { components: ComponentData[]; selectedComponent: string } => ({
  components: filteredComponentsSelector(state),
  selectedComponent: state.ui.selectedComponent!, // TODO: Tech debt
});

const actionCreators = {
  favouriteComponent,
  updateAndSelectComponent,
  startComponent,
  stopComponent,
};

const Container = connect(mapStateToProps, actionCreators)(ComponentList);

export default Container;
