import { connect } from 'react-redux';
import {
  buildComponent,
  bumpComponent,
  installComponent,
  showCloneComponentDialog,
  linkComponent,
  openInCode,
  promoteComponent,
  setUseCacheOnComponent,
  unlinkComponent,
  updateAndSelectComponent,
} from '../../actions/components';
import { ComponentDetails } from './ComponentDetails';

import { ComponentData, AppState } from '../../../common/types';

const getSelectedComponent = (state: AppState): ComponentData | null => {
  let found = null;
  if (state.ui && state.ui.selectedComponent) {
    state.components.forEach((component: ComponentData): void => {
      if (component.name === state.ui.selectedComponent) {
        found = component;
      }
    });
  }
  return found;
};

const mapStateToProps = (state: AppState): { component: ComponentData | null; editors: string[] } => ({
  component: getSelectedComponent(state),
  editors: state.ui.editors,
});

const actionCreators = {
  buildComponent,
  bumpComponent,
  showCloneComponentDialog,
  installComponent,
  linkComponent,
  openInCode,
  promoteComponent,
  updateAndSelectComponent,
  setUseCacheOnComponent,
  unlinkComponent,
};

const Container = connect(mapStateToProps, actionCreators)(ComponentDetails);

export default Container;
