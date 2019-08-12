import { connect } from 'react-redux';
import { cloneComponent, createModule, showDialog, hideDialog } from '../../actions/components';
import App from './App';
import { AppState } from '../../../common/types';

const mapDispatchToProps = (dispatch: any): {} => ({
  cloneComponent: (name: string, cloneName: string, description: string) => {
    dispatch(cloneComponent(name, cloneName, description));
  },
  hideDialog: (name: string): void => {
    dispatch(hideDialog(name));
  },
  showDialog: (name: string): void => {
    dispatch(showDialog(name));
  },
  submitModule: (name: string, description: string, type: string): void => {
    dispatch(createModule(name, description, type));
  },
});

const mapStateToProps = (state: AppState): {} => ({
  outOfDate: state.ui.outOfDate,
  componentToClone: state.ui.componentToClone,
  showCreateDialog: state.ui.showDialog === 'create',
  showCloneDialog: state.ui.showDialog === 'clone',
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default Container;
