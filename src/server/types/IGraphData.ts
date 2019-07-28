interface IGraphData {
  edges: Array<{
    from: number;
    to: number;
  }>;
  nodes: Array<{
    id: number;
    name: string;
  }>;
}

export default IGraphData;
