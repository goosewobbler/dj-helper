import * as React from 'react';
import { render, RenderResult, act } from '@testing-library/react';
import { ipcRenderer } from 'electron';
// import ReactGraphVis from 'react-graph-vis';
import Graph from '../../../src/renderer/components/ComponentDetails/Graph';
import { GraphData } from '../../../src/common/types';

let graph: RenderResult;
let mockGraphData: GraphData;

jest.mock('../../../src/renderer/components/LoadingIcon', () => ({
  LoadingIcon: (): React.ReactElement => <p>loading</p>,
}));

jest.mock('react-graph-vis', () => ({
  __esModule: true,
  default: (): React.ReactElement => <p>graph</p>,
}));

jest.mock('electron', () => ({
  ipcRenderer: {
    once: jest.fn(),
    send: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

const onSelect = jest.fn();

describe('given a dependency graph', () => {
  beforeEach(() => {
    graph = render(<Graph onSelect={onSelect} componentName="test-component" type="dependency" />);
  });

  afterEach(() => {
    graph.unmount();
  });

  it('should make the expected data request', () => {
    const { send } = ipcRenderer;
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('get-dependency-graph', 'test-component');
  });

  it('should render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });
});

describe.only('given a dependency graph with some data', () => {
  mockGraphData = {
    edges: [
      {
        from: 0,
        to: 1,
      },
      {
        from: 0,
        to: 2,
      },
    ],
    nodes: [
      {
        id: 0,
        name: 'bbc-morph-foo',
      },
      {
        id: 1,
        name: 'bbc-morph-bar',
      },
      {
        id: 2,
        name: 'bbc-morph-baz',
      },
    ],
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    const { once, removeAllListeners } = ipcRenderer;
    let sendGraphDataTimeout: ReturnType<typeof setTimeout>;
    (removeAllListeners as jest.Mock).mockImplementation(() => {
      clearTimeout(sendGraphDataTimeout);
    });
    (once as jest.Mock).mockImplementation((channel, listener) => {
      sendGraphDataTimeout = setTimeout(() => {
        listener({}, mockGraphData);
      }, 10);
    });
    graph = render(<Graph onSelect={onSelect} componentName="test-component" type="dependency" />);
  });

  afterEach(() => {
    graph.unmount();
  });

  it('should initially render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render a graph after it receives data', () => {
    act(() => {
      jest.advanceTimersByTime(11);
    });
    expect(graph.getByText('graph')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });
});
