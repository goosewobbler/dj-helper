import ComponentData from '../../types/ComponentData';

interface IServer {
  sendComponentData(data: ComponentData): void;
}

export default IServer;
