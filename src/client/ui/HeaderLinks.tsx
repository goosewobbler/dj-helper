import glamorous from 'glamorous';
import { tail } from 'lodash/fp';
import * as React from 'react';
import { pure } from 'recompose';

import Spacer from './Spacer';

const HeaderLinksDiv = glamorous.div({
  display: 'flex',
  flexShrink: 0,
  height: '38px',
  marginRight: '20px',
});

const addSpacers = (elements: any[]) =>
  tail(elements.reduce((acc, element, index) => [...acc, <Spacer key={`spacer-${index}`} />, element], []));

interface IHeaderLinksProps {
  children: any;
}

const HeaderLinks = (props: IHeaderLinksProps) => <HeaderLinksDiv>{addSpacers(props.children)}</HeaderLinksDiv>;

export default pure(HeaderLinks);
