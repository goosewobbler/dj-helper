export default interface GraphData {
  edges: {
    from: number;
    to: number;
  }[];
  nodes: {
    id: number;
    name: string;
  }[];
}
