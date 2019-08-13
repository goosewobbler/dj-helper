import { connect } from 'react-redux';
import ComponentListFilter from './ComponentListFilter';

import { filterComponents } from '../../actions/components';
import { Dispatch } from '../../../common/types';
import { AnyAction } from 'redux';

const mapStateToProps = (): {} => ({});

const mapDispatchToProps = (dispatch: Dispatch): {} => ({
  onInput: (filter: string): AnyAction => dispatch(filterComponents(filter)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentListFilter);

export default Container;
