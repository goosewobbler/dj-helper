import { connect } from 'react-redux';
import { cloneComponent, createModule, showCloneDialog, showCreateDialog } from '../../actions/components';
import App from './App';
import { AppState } from '../../../common/types';

const mapDispatchToProps = (dispatch: any) => ({
  cloneComponent: (name: string, cloneName: string, description: string) => {
    dispatch(cloneComponent(name, cloneName, description));
  },
  hideCloneDialog: () => {
    dispatch(showCloneDialog(null));
  },
  showCreateDialog: (show: boolean) => {
    dispatch(showCreateDialog(show));
  },
  submitModule: (name: string, description: string, type: string) => {
    dispatch(createModule(name, description, type));
  },
});

const mapStateToProps = (state: AppState) => ({
  cloningName: state.ui.cloningName,
  shouldShowCreateDialog: state.ui.showCreateDialog,
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default Container;
