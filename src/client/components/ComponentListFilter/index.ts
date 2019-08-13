import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import ComponentListFilter from './ComponentListFilter';

import { filterComponents } from '../../actions/components';
import { Dispatch } from '../../../common/types';

const mapStateToProps = (): {} => ({});

const mapDispatchToProps = (dispatch: Dispatch): {} => ({
  onInput: (filter: string): AnyAction => dispatch(filterComponents(filter)),
});

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentListFilter);

export default Container;
