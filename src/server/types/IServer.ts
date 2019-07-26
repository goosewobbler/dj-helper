import IComponentData from '../../types/IComponentData';

interface IServer {
  sendComponentData(data: IComponentData): void;
}

export default IServer;
