import { connect } from 'react-redux';
import ComponentListFilter from '../components/ComponentListFilter';

import { filterComponents } from '../actions/components';
import { State } from '../store';

const mapStateToProps = (state: State) => ({});

const mapDispatchToProps = (dispatch: any) => ({
  onInput: (filter: string) => dispatch(filterComponents(filter)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentListFilter);

export default Container;
