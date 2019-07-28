import ComponentHandlers from '../types/ComponentHandlers';
import ComponentData from '../../types/ComponentData';

export default interface ComponentContext {
  component: ComponentData;
  handlers: ComponentHandlers;
}
