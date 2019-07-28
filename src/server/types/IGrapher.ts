import IGraphData from './IGraphData';

interface IGrapher {
  getDependantData(name: string): IGraphData;
  getDependencyData(name: string): IGraphData;
}

export default IGrapher;
