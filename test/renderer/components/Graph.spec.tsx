import * as React from 'react';
import { render, RenderResult, act, fireEvent } from '@testing-library/react';
import { ipcRenderer } from 'electron';
import Graph, { GraphProps } from '../../../src/renderer/components/ComponentDetails/Graph';
import { GraphData, AnyObject } from '../../../src/common/types';

type GraphOptions = {
  edges: AnyObject;
  layout: { hierarchical: AnyObject };
  nodes: AnyObject;
};

let graph: RenderResult;
let suppliedOptions: GraphOptions;
const mockGraphNetworkFocus = jest.fn();

jest.mock('../../../src/renderer/components/LoadingIcon', () => ({
  LoadingIcon: (): React.ReactElement => <p>loading</p>,
}));

jest.mock('react-graph-vis', () => ({
  __esModule: true,
  default: ({
    getNetwork,
    events: { doubleClick },
    options,
  }: {
    getNetwork: ({ focus }: { focus: typeof mockGraphNetworkFocus }) => void;
    events: { doubleClick: ({ nodes }: { nodes: number[] }) => void };
    options: GraphOptions;
  }): React.ReactElement => {
    getNetwork({
      focus: mockGraphNetworkFocus,
    });
    const clickHandler = (nodeId: number): React.MouseEventHandler => (): void => {
      doubleClick({
        nodes: [nodeId],
      });
    };
    suppliedOptions = options;
    // suppliedOptions.nodes = options.nodes;
    return (
      <>
        <div onDoubleClick={clickHandler(0)}>node 1</div>
        <div onDoubleClick={clickHandler(1)}>node 2</div>
        <div onDoubleClick={clickHandler(2)}>node 3</div>
      </>
    );
  },
}));

jest.mock('electron', () => ({
  ipcRenderer: {
    once: jest.fn(),
    send: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

const onSelect = jest.fn();

const renderGraphWithData = (mockGraphData: GraphData, graphType: GraphProps['type']): void => {
  let sendGraphDataTimeout: ReturnType<typeof setTimeout>;
  (ipcRenderer.removeAllListeners as jest.Mock).mockImplementation(() => {
    clearTimeout(sendGraphDataTimeout);
  });
  (ipcRenderer.once as jest.Mock).mockImplementation(
    (channel, listener: (event: AnyObject, graphData: typeof mockGraphData) => void) => {
      sendGraphDataTimeout = setTimeout(() => {
        listener({}, mockGraphData);
      }, 100);
    },
  );
  graph = render(<Graph onSelect={onSelect} componentName="test-component" type={graphType} />);
};

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

afterEach(() => {
  graph.unmount();
});

describe('given a dependency graph', () => {
  beforeEach(() => {
    graph = render(<Graph onSelect={onSelect} componentName="test-component" type="dependency" />);
  });

  it('should make the expected data request', () => {
    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('get-dependency-graph', 'test-component');
  });

  it('should render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });
});

describe('given a dependant graph', () => {
  beforeEach(() => {
    graph = render(<Graph onSelect={onSelect} componentName="test-component" type="dependant" />);
  });

  it('should make the expected data request', () => {
    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('get-dependant-graph', 'test-component');
  });

  it('should render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });
});

describe('given a dependency graph with some data', () => {
  beforeEach(() => {
    renderGraphWithData(
      {
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
      },
      'dependency',
    );
  });

  it('should initially render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });

  describe('after it receives data', () => {
    beforeEach(() => {
      act(() => {
        jest.advanceTimersByTime(101);
      });
    });

    it('should render a graph with the expected options', () => {
      expect(graph.getByText('node 1')).toBeInTheDocument();
      expect(graph.getByText('node 2')).toBeInTheDocument();
      expect(graph.getByText('node 3')).toBeInTheDocument();
      expect(suppliedOptions.layout.hierarchical).toMatchObject(expect.objectContaining({ direction: 'UD' }));
      expect(suppliedOptions).toMatchSnapshot();
    });

    it('should focus the first node in the array', () => {
      expect(mockGraphNetworkFocus).toHaveBeenCalledWith(0, { scale: 1 });
    });

    it('should call onSelect with the name of the selected node when the doubleClick handler is fired', () => {
      const node1 = graph.getByText('node 1');
      fireEvent.doubleClick(node1);
      expect(onSelect).toHaveBeenCalledWith('bbc-morph-foo');

      const node2 = graph.getByText('node 2');
      fireEvent.doubleClick(node2);
      expect(onSelect).toHaveBeenCalledWith('bbc-morph-bar');

      const node3 = graph.getByText('node 3');
      fireEvent.doubleClick(node3);
      expect(onSelect).toHaveBeenCalledWith('bbc-morph-baz');
    });

    it('should render the expected html', () => {
      expect(graph.container).toMatchSnapshot();
    });
  });
});

describe('given a dependant graph with some data', () => {
  beforeEach(() => {
    renderGraphWithData(
      {
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
      },
      'dependant',
    );
  });

  it('should initially render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });

  describe('after it receives data', () => {
    beforeEach(() => {
      act(() => {
        jest.advanceTimersByTime(101);
      });
    });

    it('should render a graph with the expected options', () => {
      expect(graph.getByText('node 1')).toBeInTheDocument();
      expect(graph.getByText('node 2')).toBeInTheDocument();
      expect(graph.getByText('node 3')).toBeInTheDocument();
      expect(suppliedOptions.layout.hierarchical).toMatchObject(expect.objectContaining({ direction: 'DU' }));
      expect(suppliedOptions).toMatchSnapshot();
    });

    it('should focus the first node in the array', () => {
      expect(mockGraphNetworkFocus).toHaveBeenCalledWith(0, { scale: 1 });
    });

    it('should call onSelect with the name of the selected node when the doubleClick handler is fired', () => {
      const node1 = graph.getByText('node 1');
      fireEvent.doubleClick(node1);
      expect(onSelect).toHaveBeenCalledWith('bbc-morph-foo');

      const node2 = graph.getByText('node 2');
      fireEvent.doubleClick(node2);
      expect(onSelect).toHaveBeenCalledWith('bbc-morph-bar');

      const node3 = graph.getByText('node 3');
      fireEvent.doubleClick(node3);
      expect(onSelect).toHaveBeenCalledWith('bbc-morph-baz');
    });

    it('should render the expected html', () => {
      expect(graph.container).toMatchSnapshot();
    });
  });
});

describe('given a dependant graph with some data but no nodes', () => {
  beforeEach(() => {
    renderGraphWithData(
      {
        edges: [],
        nodes: [],
      },
      'dependant',
    );
  });

  it('should initially render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });

  describe('after it receives data', () => {
    beforeEach(() => {
      act(() => {
        jest.advanceTimersByTime(101);
      });
    });

    it('should render the expected messsge', () => {
      expect(graph.container).toHaveTextContent('The dependant graph of this module has no nodes.');
    });

    it('should render the expected html', () => {
      expect(graph.container).toMatchSnapshot();
    });
  });
});

describe('given a dependency graph with some data but no nodes', () => {
  beforeEach(() => {
    renderGraphWithData(
      {
        edges: [],
        nodes: [],
      },
      'dependency',
    );
  });

  it('should initially render a loading icon', () => {
    expect(graph.getByText('loading')).toBeInTheDocument();
  });

  it('should render the expected html', () => {
    expect(graph.container).toMatchSnapshot();
  });

  describe('after it receives data', () => {
    beforeEach(() => {
      act(() => {
        jest.advanceTimersByTime(101);
      });
    });

    it('should render the expected messsge', () => {
      expect(graph.container).toHaveTextContent('The dependency graph of this module has no nodes.');
    });

    it('should render the expected html', () => {
      expect(graph.container).toMatchSnapshot();
    });
  });
});
