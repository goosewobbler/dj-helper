import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { showDialog, hideDialog } from '../../actions/app';
import { createComponent } from '../../actions/components';
import App from './App';
import { AppState, Dispatch, Theme } from '../../../common/types';

const mapDispatchToProps = (
  dispatch: Dispatch,
): {
  hideDialog: () => void;
  showDialog: (name: string) => void;
  createComponent: (name: string, description: string, type: string) => void;
  cloneComponent: (name: string, description: string, sourceComponent: string) => void;
} => ({
  hideDialog: (): void => {
    dispatch(hideDialog());
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

type AppProps = {
  componentToClone: string;
  showCreateDialog: boolean;
  showCloneDialog: boolean;
  theme: Theme;
};

const mapStateToProps = (state: AppState): AppProps => ({
  componentToClone: state.ui.componentToClone!,
  showCreateDialog: state.ui.showDialog === 'create',
  showCloneDialog: state.ui.showDialog === 'clone',
  theme: state.ui.theme!,
});

const Container = connect(mapStateToProps, mapDispatchToProps)(App);

// export default Container;
export default hot(module)(Container);
