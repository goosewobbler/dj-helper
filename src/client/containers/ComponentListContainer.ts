import { assign } from 'lodash/fp';
import { connect } from 'react-redux';

import ComponentData from '../../types/ComponentData';
import { favouriteComponent, startComponent, stopComponent, updateAndSelectComponent } from '../actions/components';
import ComponentList from '../components/ComponentList';
import findOrderedSearchResults from '../helpers/resultsHelper';
import IState from '../types/IState';

const getSortedComponents = (components: ComponentData[]): ComponentData[] => {
  return components.sort((mA: ComponentData, mB: ComponentData) => {
    if (mA.favorite && !mB.favorite) {
      return -1;
    }
    if (!mA.favorite && mB.favorite) {
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

const mapStateToProps = (state: IState) => {
  const { filter } = state.ui;
  return {
    components: getComponents(state.components, filter),
    filter,
    selectedComponent: state.ui.selectedComponent,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  onFavouriteComponent: (component: ComponentData, favorite: boolean) =>
    dispatch(favouriteComponent(component.name, favorite)),
  onSelectComponent: (component: ComponentData) => dispatch(updateAndSelectComponent(component.name)),
  onStartComponent: (name: string) => dispatch(startComponent(name)),
  onStopComponent: (name: string) => dispatch(stopComponent(name)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentList);

export default Container;
