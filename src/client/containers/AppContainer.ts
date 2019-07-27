import { connect } from 'react-redux';
import { createModule, showCreateDialog } from '../actions/components';
import App from '../components/App';
import IState from '../types/IState';

const mapDispatchToProps = (dispatch: any) => ({
  showCreateDialog: (show: boolean) => {
    dispatch(showCreateDialog(show));
  },
  submitModule: (name: string, description: string, type: string) => {
    dispatch(createModule(name, description, type));
  },
});

const mapStateToProps = (state: IState) => ({
  shouldShowCreateDialog: state.ui.showCreateDialog,
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default Container;
