import { connect } from 'react-redux';

import {
  buildComponent,
  bumpComponent,
  installComponent,
  linkComponent,
  openInCode,
  promoteComponent,
  setUseCacheOnComponent,
  showDialog,
  unlinkComponent,
  updateAndSelectComponent,
} from '../../actions/components';
import ComponentDetails from './ComponentDetails';

import { ComponentData, AppState } from '../../../common/types';

const getSelectedComponent = (state: AppState): ComponentData => {
  let found = null;
  if (state.ui && state.ui.selectedComponent) {
    state.components.forEach((component: ComponentData) => {
      if (component.name === state.ui.selectedComponent) {
        found = component;
      }
    });
  }
  return found;
};

const mapStateToProps = (state: AppState) => ({
  component: getSelectedComponent(state),
  editors: state.ui.editors,
});

const mapDispatchToProps = (dispatch: any) => ({
  handlers: {
    onBuild: (name: string) => dispatch(buildComponent(name)),
    onBumpComponent: (name: string, type: string) => dispatch(bumpComponent(name, type)),
    onClone: (name: string) => dispatch(showDialog('clone', name)),
    onInstall: (name: string) => dispatch(installComponent(name)),
    onLinkComponent: (name: string, dependency: string) => dispatch(linkComponent(name, dependency)),
    onOpenInCode: (name: string) => dispatch(openInCode(name)),
    onPromoteComponent: (name: string, environment: string) => dispatch(promoteComponent(name, environment)),
    onSelectComponent: (name: string) => dispatch(updateAndSelectComponent(name)),
    onSetUseCache: (name: string, value: boolean) => dispatch(setUseCacheOnComponent(name, value)),
    onUnlinkComponent: (name: string, dependency: string) => dispatch(unlinkComponent(name, dependency)),
  },
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentDetails);

export default Container;
