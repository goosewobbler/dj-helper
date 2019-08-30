import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import ComponentListFilter from './ComponentListFilter';

import { filterComponents } from '../../actions/app';
import { Dispatch } from '../../../common/types';

const mapStateToProps = (): {} => ({});

const mapDispatchToProps = (dispatch: Dispatch): { onInput: Function } => ({
  onInput: (filter: string): AnyAction => dispatch(filterComponents(filter)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentListFilter);

export default Container;
