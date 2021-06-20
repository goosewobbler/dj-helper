import { GraphData } from '../../common/types';

type Grapher = {
  getDependantData(name: string): GraphData;
  getDependencyData(name: string): GraphData;
};

type Node = {
  id: number;
  name: string;
};

type Edge = {
  from: number;
  to: number;
};

const createGrapher = (dependencies: { [Key: string]: { name: string }[] }): Grapher => {
  const nodes: Node[] = [];
  const edgesDownMap: { [Key: number]: number[] } = [];
  const edgesUpMap: { [Key: number]: number[] } = [];

  const getIdOfNode = (name: string): number | null => {
    const node = nodes.find((n): boolean => n.name === name);
    return node ? node.id : null;
  };

  Object.keys(dependencies).forEach((name, index): void => {
    nodes.push({ id: index, name });
  });

  Object.keys(dependencies).forEach((name, index): void => {
    const dependencyDependencies = dependencies[name];

    dependencyDependencies.forEach((dependencyDependency): void => {
      const to = getIdOfNode(dependencyDependency.name);

      if (to !== null) {
        edgesDownMap[index] = edgesDownMap[index] || [];
        edgesDownMap[index].push(to);
        edgesUpMap[to] = edgesUpMap[to] || [];
        edgesUpMap[to].push(index);
      }
    });
  });

  const follow = (
    name: string,
    edgesMap: { [Key: number]: number[] },
    totalNodes: Node[],
    totalEdges: Edge[],
  ): void => {
    const node = nodes.find((n): boolean => n.name === name);
    if (node && !totalNodes.includes(node)) {
      totalNodes.push(node);
      if (Array.isArray(edgesMap[node.id])) {
        edgesMap[node.id].forEach((e): void => {
          totalEdges.push({ from: node.id, to: e });

          const toNode: Node = nodes.find((n): boolean => n.id === e) as Node;
          follow(toNode.name, edgesMap, totalNodes, totalEdges);
        });
      }
    }
  };

  const getDependantData = (name: string): GraphData => {
    const nodesSubset: Node[] = [];
    const edgesSubset: Edge[] = [];

    follow(name, edgesUpMap, nodesSubset, edgesSubset);

    return {
      edges: edgesSubset,
      nodes: nodesSubset,
    };
  };

  const getDependencyData = (name: string): GraphData => {
    const nodesSubset: Node[] = [];
    const edgesSubset: Edge[] = [];

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

export { createGrapher, Grapher };
