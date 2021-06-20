import { connect } from 'react-redux';
import { ComponentListFilter } from './ComponentListFilter';

import { filterComponents } from '../../actions/app';
import { AnyObject } from '../../../common/types';

const mapStateToProps = (): AnyObject => ({}); // TODO: try null

const actionCreators = { filterComponents };

const Container = connect(mapStateToProps, actionCreators)(ComponentListFilter);

export default Container;
