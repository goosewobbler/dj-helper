import { connect } from 'react-redux';
import UpdateBar from '../components/UpdateBar';

import { update } from '../actions/components';
import { State } from '../store';

const mapStateToProps = (state: State) => ({
  outOfDate: state.ui.outOfDate,
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
