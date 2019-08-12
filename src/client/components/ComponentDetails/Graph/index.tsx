import * as React from 'react';
import GraphVis from 'react-graph-vis';

import { GraphData } from '../../../../common/types';
import LoadingIcon from '../../LoadingIcon';
import { logError } from '../../../../server/helpers/console';

interface GraphProps {
  url: string;
  down: boolean;
  onSelect(name: string): any;
}

interface GraphState {
  data: GraphData;
}

const convertData = (data: GraphData) => {
  const newNodes = data.nodes.map(node => ({ id: node.id, label: node.name.replace(/^bbc-morph-/, '') }));
  return {
    edges: data.edges,
    nodes: newNodes,
  };
};

class Graph extends React.PureComponent<GraphProps, GraphState> {
  constructor(props: GraphProps) {
    super(props);

    this.state = {
      data: null,
    };
  }

  public componentDidMount() {
    this.update();
  }

  public componentDidUpdate() {
    const { data } = this.state;
    if (!data) {
      this.update();
    }
  }

  public componentWillReceiveProps(nextProps: GraphProps) {
    const { url } = this.props;
    if (nextProps.url !== url) {
      this.setState({ data: null });
    }
  }

  public render() {
    return <div>{this.renderGraph()}</div>;
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

  private renderGraph(): React.ReactElement {
    const { data } = this.state;

    if (data) {
      const { down } = this.props;
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
        doubleClick: (event: any) => {
          const id = event.nodes[0];
          const { name } = data.nodes.find(n => n.id === id);
          this.props.onSelect(name);
        },
      };

      const currentNode = data.nodes[0].id;

      return (
        <GraphVis
          ref={(g: any): void => {
            if (g) {
              g.Network.focus(currentNode, {
                scale: 1,
              });
            }
          }}
          graph={convertData(data)}
          events={events}
          options={options}
        />
      );
    }

    return (
      <div className="loading">
        <div>
          <LoadingIcon />
        </div>
      </div>
    );
  }
}

export default Graph;
