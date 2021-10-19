import { Browser, List, Settings, Track } from '../../src/common/types';

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
      triggerLoad: false,
      triggerPlay: false,
      triggerPause: false,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      isResizing: false,
      trackContext: 'browser',
    },
    tracks,
    browsers,
    settings: {
      darkModeEnabled: false,
      autoplayEnabled: true,
      trackPreviewEmbedSize: 'small' as Settings['trackPreviewEmbedSize'],
    },
    status: {
      statusText: '',
    },
  };
}
