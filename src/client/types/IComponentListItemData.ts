import ComponentState from '../../types/ComponentState';

export default interface IComponentListItemData {
  name: string;
  displayName: string;
  highlighted?: any[];
  url: string;
  favourite: boolean;
  state: ComponentState;
}
