import GraphData from './GraphData';

export default interface Grapher {
  getDependantData(name: string): GraphData;
  getDependencyData(name: string): GraphData;
}
