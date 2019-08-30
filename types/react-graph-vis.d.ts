declare module 'react-graph-vis' {
  export default function render({
    getNetwork,
    graph,
    events,
    options,
  }: {
    getNetwork: Function;
    graph: {};
    events: {};
    options: {};
  }): React.ReactElement;
}
