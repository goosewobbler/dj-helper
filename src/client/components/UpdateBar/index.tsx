import { connect } from 'react-redux';
import UpdateBar from './UpdateBar';

import { update } from '../../actions/components';
import { AppState } from '../../../common/types';

const mapStateToProps = (state: AppState) => ({
  updated: state.ui.updated,
  updating: state.ui.updating,
});

const mapDispatchToProps = (dispatch: any) => ({
  onUpdate: () => dispatch(update()),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateBar);

export default Container;
