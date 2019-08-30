import * as React from 'react';
import GraphVis from 'react-graph-vis';

import { GraphData } from '../../../../common/types';
import LoadingIcon from '../../LoadingIcon';
import { logError } from '../../../../server/helpers/console';

interface GraphProps {
  url: string;
  down: boolean;
  onSelect(name: string): void;
}

interface GraphState {
  data: GraphData;
}

const convertData = (data: GraphData): {} => {
  const newNodes = data.nodes.map((node): {} => ({ id: node.id, label: node.name.replace(/^bbc-morph-/, '') }));
  return {
    edges: data.edges,
    nodes: newNodes,
  };
};

class Graph extends React.PureComponent<GraphProps, GraphState> {
  public constructor(props: GraphProps) {
    super(props);

    this.state = {
      data: null,
    };
  }

  public componentDidMount(): void {
    this.update();
  }

  public componentWillReceiveProps(nextProps: GraphProps): void {
    const { url } = this.props;
    if (nextProps.url !== url) {
      this.setState({ data: null });
    }
  }

  public componentDidUpdate(): void {
    const { data } = this.state;
    if (!data) {
      this.update();
    }
  }

  private update(): void {
    const { url } = this.props;
    fetch(url)
      .then((res): Promise<GraphData> => res.json())
      .then((data): void => {
        this.setState({ data });
      })
      .catch(logError);
  }

  public renderGraph(data: GraphData): React.ReactElement {
    const { down, onSelect } = this.props;
    const options = {
      edges: {
        arrows: {
          from: {
            enabled: !down,
            scaleFactor: 0.5,
          },
          to: {
            enabled: down,
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
          direction: down ? 'UD' : 'DU',
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
        const { name } = data.nodes.find((n): boolean => n.id === id);
        onSelect(name);
      },
    };

    const currentNode = data.nodes[0].id;

    return (
      <GraphVis
        getNetwork={(network: { focus: Function }): void => {
          network.focus(currentNode, {
            scale: 1,
          });
        }}
        graph={convertData(data)}
        events={events}
        options={options}
      />
    );
  }

  public render(): React.ReactElement {
    const { data } = this.state;
    return (
      <div>
        {data ? (
          this.renderGraph(data)
        ) : (
          <div className="loading">
            <div>
              <LoadingIcon />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Graph;
