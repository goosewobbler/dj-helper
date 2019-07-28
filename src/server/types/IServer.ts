import ComponentData from '../../types/IComponentData';

interface IServer {
  sendComponentData(data: ComponentData): void;
}

export default IServer;
