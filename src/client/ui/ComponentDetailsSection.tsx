import glamorous from 'glamorous';
import * as React from 'react';
import { pure } from 'recompose';

import ITheme from '../../types/ITheme';

const ContainingDiv = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
  },
  (props: { grow?: number }) => ({
    flexGrow: props.grow || 0,
    flexShrink: props.grow ? 1 : 0,
  }),
);

const HeaderDiv = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '18px 8px 8px',
});

const ContentDiv = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
  },
  (props: { grow?: number }) => ({
    flexGrow: props.grow || 0,
    flexShrink: props.grow ? 1 : 0,
  }),
);

const LabelH3 = glamorous.h3(
  {
    fontSize: '18px',
    fontWeight: 'normal',
  },
  (props: { theme: ITheme }) => ({
    color: props.theme.primaryTextColour,
  }),
);

interface IComponentDetailsSectionProps {
  theme: ITheme;
  children?: any;
  grow?: number;
  label: string;
  end?: React.ReactElement<any>;
}

const ComponentDetailsSection = (props: IComponentDetailsSectionProps) => (
  <ContainingDiv grow={props.grow}>
    <HeaderDiv>
      <LabelH3 theme={props.theme}>{props.label}</LabelH3>
      {props.end}
    </HeaderDiv>
    <ContentDiv grow={props.grow}>{props.children}</ContentDiv>
  </ContainingDiv>
);

export default pure(ComponentDetailsSection);
