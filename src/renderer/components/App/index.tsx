import { connect } from 'react-redux';
import { showDialog, hideDialog } from '../../actions/app';
import { createComponent, cloneComponent } from '../../actions/components';
import { App } from './App';
import { AppState } from '../../../common/types';

const actionCreators = {
  hideDialog,
  showDialog,
  createComponent,
  cloneComponent,
};

type AppProps = {
  componentToClone: string;
  showCreateDialog: boolean;
  showCloneDialog: boolean;
};

const mapStateToProps = (state: AppState): AppProps => ({
  componentToClone: state.ui.componentToClone!, // TODO: Tech debt
  showCreateDialog: state.ui.showDialog === 'create' && !state.ui.hideDialog,
  showCloneDialog: state.ui.showDialog === 'clone' && !state.ui.hideDialog,
});

const Container = connect(mapStateToProps, actionCreators)(App);

export default Container;
