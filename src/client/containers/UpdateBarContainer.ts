import { connect } from 'react-redux';
import UpdateBar from '../components/UpdateBar';

import { update } from '../actions/components';
import IState from '../types/IState';

const mapStateToProps = (state: IState) => ({
  outOfDate: state.ui.outOfDate,
  theme: state.ui.theme,
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
