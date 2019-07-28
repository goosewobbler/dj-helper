import glamorous from 'glamorous';
import * as React from 'react';
import { pure } from 'recompose';

import ITheme from '../../types/ITheme';
import Spacer from './Spacer';

const LIST_PROPORTION = 0.3;

const ContainingDiv = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  (props: { theme: ITheme }) => ({
    backgroundColor: props.theme.primaryBackgroundColour,
    fontFamily: props.theme.font,
  }),
);

const HeaderDiv = glamorous.div(
  {
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'space-between',
    padding: '12px',
    zIndex: 1,
  },
  (props: { theme: ITheme }) => ({
    backgroundColor: props.theme.headerColour,
  }),
);

const ContentDiv = glamorous.div({
  display: 'flex',
  flexGrow: 1,
});

const SectionDiv = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
    padding: '8px',
  },
  (props: { proportion: number }) => ({
    flexBasis: `${props.proportion * 100}%`,
  }),
);

interface IAppContainerProps {
  banner: any;
  dialog: any;
  header: any;
  leftPanel: any;
  rightPanel: any;
  theme: ITheme;
}

const AppContainer = (props: IAppContainerProps) => (
  <ContainingDiv theme={props.theme}>
    {props.banner}
    <HeaderDiv theme={props.theme}>{props.header}</HeaderDiv>
    <Spacer />
    <ContentDiv>
      <SectionDiv proportion={LIST_PROPORTION}>{props.leftPanel}</SectionDiv>
      <SectionDiv proportion={1 - LIST_PROPORTION}>{props.rightPanel}</SectionDiv>
      {props.dialog}
    </ContentDiv>
  </ContainingDiv>
);

export default pure(AppContainer);
