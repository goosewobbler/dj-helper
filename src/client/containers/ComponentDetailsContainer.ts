import { connect } from 'react-redux';
import IComponentData from '../../types/IComponentData';
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
} from '../actions/components';
import ComponentDetails from '../components/ComponentDetails';
import IState from '../types/IState';

const getSelectedComponent = (state: IState): IComponentData => {
  let found = null;
  if (state.ui && state.ui.selectedComponent) {
    state.components.forEach((component: IComponentData) => {
      if (component.name === state.ui.selectedComponent) {
        found = component;
      }
    });
  }
  return found;
};

const mapStateToProps = (state: IState) => ({
  component: getSelectedComponent(state),
  editors: state.ui.editors,
});

const mapDispatchToProps = (dispatch: any) => ({
  onBuild: (name: string) => dispatch(buildComponent(name)),
  onBumpComponent: (name: string, type: string) => dispatch(bumpComponent(name, type)),
  onInstall: (name: string) => dispatch(installComponent(name)),
  onLinkComponent: (name: string, dependency: string) => dispatch(linkComponent(name, dependency)),
  onOpenInCode: (name: string) => dispatch(openInCode(name)),
  onPromoteComponent: (name: string, environment: string) => dispatch(promoteComponent(name, environment)),
  onSelectComponent: (name: string) => dispatch(updateAndSelectComponent(name)),
  onSetUseCache: (name: string, value: boolean) => dispatch(setUseCacheOnComponent(name, value)),
  onUnlinkComponent: (name: string, dependency: string) => dispatch(unlinkComponent(name, dependency)),
});

const Container = connect(mapStateToProps, mapDispatchToProps)(ComponentDetails);

export default Container;
