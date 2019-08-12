import { connect } from 'react-redux';
import ComponentListFilter from './ComponentListFilter';

import { filterComponents } from '../../actions/components';

const mapStateToProps = (): {} => ({});

const mapDispatchToProps = (dispatch: any) => ({
  onInput: (filter: string) => dispatch(filterComponents(filter)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentListFilter);

export default Container;
