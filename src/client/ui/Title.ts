import glamorous from 'glamorous';
import { pure } from 'recompose';

import ITheme from '../../types/ITheme';

const Title = glamorous.h1(
  {
    fontSize: '32px',
    fontWeight: 'normal',
  },
  (props: { theme: ITheme }) => ({
    color: props.theme.primaryTextColour,
  }),
);

export default pure(Title);
