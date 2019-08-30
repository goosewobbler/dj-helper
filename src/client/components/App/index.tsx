import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { showDialog, hideDialog } from '../../actions/app';
import { createComponent } from '../../actions/components';
import App from './App';
import { AppState, Dispatch } from '../../../common/types';

const mapDispatchToProps = (dispatch: Dispatch): {} => ({
  hideDialog: (name: string): void => {
    dispatch(hideDialog(name));
  },
  showDialog: (name: string): void => {
    dispatch(showDialog(name));
  },
  createComponent: (name: string, description: string, type: string): void => {
    dispatch(createComponent(name, description, type));
  },
  cloneComponent: (name: string, description: string, sourceComponent: string): void => {
    dispatch(createComponent(name, description, 'clone', sourceComponent));
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

// export default Container;
export default hot(module)(Container);
