import glamorous from 'glamorous';
import { pure } from 'recompose';

import ITheme from '../../types/ITheme';

const ListItemButton = glamorous.div(
  {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    fontSize: '18px',
    height: '39px',
    marginBottom: '8px',
    overflow: 'hidden',
    padding: '8px',
  },
  (props: { theme: ITheme; backgroundColor: string; highlighted?: boolean }) => ({
    backgroundColor: props.backgroundColor || props.theme.primaryBackgroundColour,
    border: `1px solid rgba(0, 0, 0, ${props.highlighted ? '0' : '0.1'})`,
    boxShadow: props.highlighted
      ? `0px 0px 0px 3px ${props.theme.selectedItemBorderColour}`
      : '2px 2px 4px 0 rgba(0, 0, 0, 0.05)',
    color: props.theme.primaryTextColour,
  }),
);

export default pure(ListItemButton);
