import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import {
  buildComponent,
  bumpComponent,
  installComponent,
  linkComponent,
  openInCode,
  promoteComponent,
  setUseCacheOnComponent,
  unlinkComponent,
  updateAndSelectComponent,
} from '../../actions/components';
import { showDialog } from '../../actions/app';
import ComponentDetails from './ComponentDetails';

import { ComponentData, AppState, Dispatch } from '../../../common/types';
import { ComponentHandlers } from '../../contexts/componentContext';

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

const mapDispatchToProps = (dispatch: Dispatch): { handlers: ComponentHandlers } => ({
  handlers: {
    onBuild: (name: string): void => dispatch(buildComponent(name)),
    onBumpComponent: (name: string, type: string): void => dispatch(bumpComponent(name, type)),
    onClone: (name: string): AnyAction => dispatch(showDialog('clone', name)),
    onInstall: (name: string): void => dispatch(installComponent(name)),
    onLinkComponent: (name: string, dependency: string): void => dispatch(linkComponent(name, dependency)),
    onOpenInCode: (name: string): void => dispatch(openInCode(name)),
    onPromoteComponent: (name: string, environment: string): void => dispatch(promoteComponent(name, environment)),
    onSelectComponent: (name: string): AnyAction => dispatch(updateAndSelectComponent(name)),
    onSetUseCache: (name: string, value: boolean): void => dispatch(setUseCacheOnComponent(name, value)),
    onUnlinkComponent: (name: string, dependency: string): void => dispatch(unlinkComponent(name, dependency)),
  },
});

const Container = connect(mapStateToProps, mapDispatchToProps)(ComponentDetails);

export default Container;
