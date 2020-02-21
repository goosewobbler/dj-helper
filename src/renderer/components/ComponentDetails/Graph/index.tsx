import { ipcRenderer } from 'electron';
import * as React from 'react';
import GraphVis from 'react-graph-vis';

import { GraphData } from '../../../../common/types';
import { LoadingIcon } from '../../LoadingIcon';

type GraphProps = {
  type: 'dependency' | 'dependant';
  componentName: string;
  onSelect(name: string): void;
};

const convertData = (data: GraphData): {} => {
  const newNodes = data.nodes.map((node): {} => ({ id: node.id, label: node.name.replace(/^bbc-morph-/, '') }));
  return {
    edges: data.edges,
    nodes: newNodes,
  };
};

const renderLoadingIcon = (): React.ReactNode => (
  <div className="flex items-center justify-center w-full h-full loading">
    <div className="w-8 h-8">
      <LoadingIcon />
    </div>
  </div>
);

const renderGraph = (data: GraphData, onSelect: GraphProps['onSelect'], type: GraphProps['type']): React.ReactNode => {
  const isDependencyGraph = type === 'dependency';
  const options = {
    edges: {
      arrows: {
        from: {
          enabled: !isDependencyGraph,
          scaleFactor: 0.5,
        },
        to: {
          enabled: isDependencyGraph,
          scaleFactor: 0.5,
        },
      },
      smooth: {
        forceDirection: 'vertical',
        roundness: 1,
        type: 'cubicBezier',
      },
    },
    layout: {
      hierarchical: {
        direction: isDependencyGraph ? 'UD' : 'DU',
        edgeMinimization: true,
        nodeSpacing: 350,
        parentCentralization: true,
        sortMethod: 'directed',
      },
      improvedLayout: true,
    },
    nodes: {
      color: {},
      font: {},
      scaling: {
        max: 30,
        min: 30,
      },
      shape: 'box',
      size: 30,
    },
    physics: {
      enabled: false,
    },
  };

  const events = {
    doubleClick: (event: { nodes: number[] }): void => {
      const {
        nodes: [id],
      } = event;
      const { name } = data.nodes.find((n): boolean => n.id === id)!;
      onSelect(name);
    },
  };

  return (
    <GraphVis
      getNetwork={(network: { focus: Function }): void => {
        if (data.nodes.length > 0) {
          const currentNode = data.nodes[0].id;
          network.focus(currentNode, {
            scale: 1,
          });
        }
      }}
      graph={convertData(data)}
      events={events}
      options={options}
    />
  );
};

const Graph = ({ onSelect, componentName, type }: GraphProps): React.ReactElement => {
  const graphDataRequested = React.useRef<boolean>();
  const [state, setState] = React.useState<{ graphData: GraphData | undefined }>({ graphData: undefined });
  React.useEffect(() => {
    const graphDataListener = (event: Event, graphData: GraphData): void => {
      setState(prevState => ({ ...prevState, graphData }));
    };
    if (!graphDataRequested.current) {
      ipcRenderer.once(`${type}-graph`, graphDataListener);
      ipcRenderer.send(`get-${type}-graph`, componentName);
      graphDataRequested.current = true;
    }

    return (): void => {
      ipcRenderer.removeAllListeners(`${type}-graph`);
    };
  });

  const { graphData } = state;

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0">
      {graphData ? renderGraph(graphData, onSelect, type) : renderLoadingIcon()}
    </div>
  );
};

// class Graph extends React.PureComponent<GraphProps, GraphState> {
//   public componentDidMount(): void {
//     this.update();
//   }

//   public componentWillReceiveProps(nextProps: GraphProps): void {
//     const { url } = this.props;
//     if (nextProps.url !== url) {
//       this.setState({ data: null });
//     }
//   }

//   public componentDidUpdate(): void {
//     const { data } = this.state;
//     if (!data) {
//       this.update();
//     }
//   }
// }

export default Graph;
export { GraphProps };
