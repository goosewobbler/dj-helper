import ComponentData from '../../types/ComponentData';

export default interface Server {
  sendComponentData(data: ComponentData): void;
}
