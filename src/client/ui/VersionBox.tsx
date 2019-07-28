import glamorous from 'glamorous';
import * as React from 'react';
import { pure } from 'recompose';

import ITheme from '../../types/Theme';
import LoadingIcon from './icon/LoadingIcon';

const LoadingButton = glamorous.button({
  background: 'none',
  border: 0,
  height: '16px',
  outline: 'none',
  width: '16px',
});

const ContainingDiv = glamorous.div(
  {
    alignItems: 'center',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  (props: {
    theme: ITheme;
    backgroundColor: string;
    fontSize: string;
    height: string;
    padding: string;
    width: string;
  }) => ({
    backgroundColor: props.backgroundColor,
    color: props.theme.secondaryTextColour,
    fontSize: props.fontSize,
    height: props.height,
    padding: props.padding,
    width: props.width,
  }),
);

const VersionBox = (props: {
  children?: any;
  theme: ITheme;
  bad?: boolean;
  fontSize: string;
  good?: boolean;
  height: string;
  padding: string;
  version: any;
  width: string;
}) => {
  let contents: any = props.children;
  let backgroundColor = props.theme.neutralColour;

  if (props.version === null) {
    contents = (
      <LoadingButton disabled={true}>
        <LoadingIcon colour={props.theme.secondaryTextColour} />
      </LoadingButton>
    );
    backgroundColor = props.theme.loadingColour;
  } else if (props.version === '') {
    contents = 'N/A';
  } else if (props.bad) {
    backgroundColor = props.theme.negativeColour;
  } else if (props.good) {
    backgroundColor = props.theme.positiveColour;
  }

  return (
    <ContainingDiv
      theme={props.theme}
      backgroundColor={backgroundColor}
      fontSize={props.fontSize}
      height={props.height}
      padding={props.padding}
      width={props.width}
    >
      {contents}
    </ContainingDiv>
  );
};

export default pure(VersionBox);
