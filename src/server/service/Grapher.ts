import IGraphData from '../types/IGraphData';
import IGrapher from '../types/IGrapher';

interface INode {
  id: number;
  name: string;
}

interface IEdge {
  from: number;
  to: number;
}

const Grapher = (dependencies: { [Key: string]: Array<{ name: string }> }): IGrapher => {
  const nodes: INode[] = [];
  const edgesDownMap: { [Key: number]: number[] } = [];
  const edgesUpMap: { [Key: number]: number[] } = [];

  const getIdOfNode = (name: string) => {
    const node = nodes.find(n => n.name === name);
    return node ? node.id : null;
  };

  Object.keys(dependencies).forEach((name, index) => {
    nodes.push({ id: index, name });
  });

  Object.keys(dependencies).forEach((name, index) => {
    const dependencyDependencies = dependencies[name];

    dependencyDependencies.forEach(dependencyDependency => {
      const to = getIdOfNode(dependencyDependency.name);

      if (to !== null) {
        edgesDownMap[index] = edgesDownMap[index] || [];
        edgesDownMap[index].push(to);
        edgesUpMap[to] = edgesUpMap[to] || [];
        edgesUpMap[to].push(index);
      }
    });
  });

  const follow = (name: string, edgesMap: { [Key: number]: number[] }, totalNodes: INode[], totalEdges: IEdge[]) => {
    const node = nodes.find(n => n.name === name);
    if (node && totalNodes.indexOf(node) === -1) {
      totalNodes.push(node);
      if (Array.isArray(edgesMap[node.id])) {
        edgesMap[node.id].forEach(e => {
          totalEdges.push({ from: node.id, to: e });

          const toNode = nodes.find(n => n.id === e);
          follow(toNode.name, edgesMap, totalNodes, totalEdges);
        });
      }
    }
  };

  const getDependantData = (name: string): IGraphData => {
    const nodesSubset: INode[] = [];
    const edgesSubset: IEdge[] = [];

    follow(name, edgesUpMap, nodesSubset, edgesSubset);

    return {
      edges: edgesSubset,
      nodes: nodesSubset,
    };
  };

  const getDependencyData = (name: string): IGraphData => {
    const nodesSubset: INode[] = [];
    const edgesSubset: IEdge[] = [];

    follow(name, edgesDownMap, nodesSubset, edgesSubset);

    return {
      edges: edgesSubset,
      nodes: nodesSubset,
    };
  };

  return {
    getDependantData,
    getDependencyData,
  };
};

export default Grapher;