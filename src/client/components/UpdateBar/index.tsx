import { connect } from 'react-redux';
import UpdateBar from './UpdateBar';

import { update } from '../../actions/app';
import { AppState, Dispatch } from '../../../common/types';

const mapStateToProps = (state: AppState): { updating: boolean; updated: boolean } => ({
  updated: state.ui.updated,
  updating: state.ui.updating,
});

const mapDispatchToProps = (dispatch: Dispatch): { onUpdate: Function } => ({
  onUpdate: (): void => dispatch(update()),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateBar);

export default Container;
