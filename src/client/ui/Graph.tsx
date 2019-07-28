import glamorous from 'glamorous';
import * as React from 'react';

import IGraphData from '../../server/types/IGraphData';
import ITheme from '../../types/ITheme';
import LoadingIcon from './icon/LoadingIcon';

const GraphVis = require('react-graph-vis').default; // tslint:disable-line no-var-requires

const ContaingingDiv = glamorous.div({
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
});

const LoadingDiv = glamorous.div({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
});

const LoadingIconContainer = glamorous.div({
  height: '32px',
  width: '32px',
});

interface IGraphProps {
  theme: ITheme;
  url: string;
  down: boolean;
  onSelect(name: string): any;
}

interface IGraphState {
  data: IGraphData;
}

const convertData = (data: IGraphData) => {
  const newNodes = data.nodes.map(node => ({ id: node.id, label: node.name.replace(/^bbc-morph-/, '') }));
  return {
    edges: data.edges,
    nodes: newNodes,
  };
};

class Graph extends React.PureComponent<IGraphProps, IGraphState> {
  constructor(props: IGraphProps) {
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

  public componentWillReceiveProps(nextProps: IGraphProps) {
    if (nextProps.url !== this.props.url) {
      this.setState({ data: null });
    }
  }

  public render() {
    return <ContaingingDiv>{this.renderGraph()}</ContaingingDiv>;
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
          color: {
            background: this.props.theme.tertiaryBackgroundColour,
            border: this.props.theme.primaryTextColour,
            highlight: {
              background: this.props.theme.tertiaryBackgroundColour,
              border: this.props.theme.highlightColour,
            },
          },
          font: {
            color: this.props.theme.tertiaryTextColour,
            face: this.props.theme.font,
          },
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
          const name = this.state.data.nodes.find(n => n.id === id).name;
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
      <LoadingDiv>
        <LoadingIconContainer>
          <LoadingIcon colour={this.props.theme.primaryTextColour} />
        </LoadingIconContainer>
      </LoadingDiv>
    );
  }
}

export default Graph;
