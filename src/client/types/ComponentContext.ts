import ComponentHandlers from '../types/ComponentHandlers';
import ComponentData from '../../types/IComponentData';

export default interface ComponentContext {
  component: ComponentData;
  handlers: ComponentHandlers;
}
