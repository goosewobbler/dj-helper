import { connect } from 'react-redux';
import ComponentListFilter from '../components/ComponentListFilter';

import { filterComponents } from '../actions/components';
import IState from '../types/IState';

const mapStateToProps = (state: IState) => ({
  theme: state.ui.theme,
});

const mapDispatchToProps = (dispatch: any) => ({
  onInput: (filter: string) => dispatch(filterComponents(filter)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentListFilter);

export default Container;
