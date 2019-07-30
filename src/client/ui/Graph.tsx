import * as React from 'react';

import GraphData from '../../server/types/GraphData';
import LoadingIcon from './icon/LoadingIcon';

const GraphVis = require('react-graph-vis').default; // tslint:disable-line no-var-requires

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
    if (!this.state.data) {
      this.update();
    }
  }

  public componentWillReceiveProps(nextProps: GraphProps) {
    if (nextProps.url !== this.props.url) {
      this.setState({ data: null });
    }
  }

  public render() {
    return <div>{this.renderGraph()}</div>;
  }

  private update() {
    fetch(this.props.url)
      .then(res => res.json())
      .then(data => {
        this.setState({ data });
      })
      .catch(console.error);
  }

  private renderGraph() {
    if (this.state.data) {
      const options = {
        edges: {
          arrows: {
            from: {
              enabled: !this.props.down,
              scaleFactor: 0.5,
            },
            to: {
              enabled: this.props.down,
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
            direction: this.props.down ? 'UD' : 'DU',
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
          const { name } = this.state.data.nodes.find(n => n.id === id);
          this.props.onSelect(name);
        },
      };

      const currentNode = this.state.data.nodes[0].id;

      return (
        <GraphVis
          ref={(g: any) => {
            if (g) {
              g.Network.focus(currentNode, {
                scale: 1,
              });
            }
          }}
          graph={convertData(this.state.data)}
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
