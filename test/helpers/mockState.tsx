import { Browser, EmbedStatus, List, Settings, Track } from '../../src/common/types';

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
    },
    tracks,
    browsers,
    settings: {
      darkModeEnabled: false,
      autoplayEnabled: true,
      windowBounds: { x: 0, y: 0, width: 1500, height: 1000 },
      trackPreviewEmbedSize: 'small' as Settings['trackPreviewEmbedSize'],
    },
    status: {
      statusText: '',
    },
  };
}
