import ComponentState from '../../types/ComponentState';
import Theme from '../../types/Theme';

export default interface IComponentListItemData {
  name: string;
  displayName: string;
  highlighted?: any[];
  url: string;
  favourite: boolean;
  state: ComponentState;
  theme: Theme;
}
