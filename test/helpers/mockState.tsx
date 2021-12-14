import { Browser, EmbedStatus, List, Track, UI } from '../../src/common/types';

export function mockState({
  browsers = [],
  lists = [],
  tracks = [],
}: {
  browsers?: Browser[];
  lists?: List[];
  tracks?: Track[];
}) {
  return {
    lists,
    embed: {
      trackId: 0,
      status: EmbedStatus.Idle,
      trackContext: 'browser',
      autoplayEnabled: true,
    },
    tracks,
    browsers,
    ui: {
      statusText: '',
      darkModeEnabled: false,
      windowBounds: { x: 0, y: 0, width: 1500, height: 1000 },
      horizontalSplitterDimensions: { listPaneWidth: 538, browserPaneWidth: 962 },
      verticalSplitterDimensions: { browserPanelHeight: 547, metaPanelHeight: 326 },
      trackPreviewEmbedSize: 'small' as UI['trackPreviewEmbedSize'],
      tabHistory: [0],
    },
  };
}
