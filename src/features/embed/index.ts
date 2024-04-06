import { log } from '../../main/helpers/console.js';
import { selectNextTrackOnMetaPanel, selectPreviousTrackOnMetaPanel } from '../browsers/index.js';
import { getNextTrackOnList, getPreviousTrackOnList } from '../lists/index.js';
import type { Thunk } from 'zutron';
import { AppState, Embed, Track, EmbedStatus, LoadContextType, AppStore } from '../../common/types.js';

export const initialState = {
  status: EmbedStatus.Idle,
  autoplayEnabled: true,
} as Embed;

type EmbedContext = { trackId?: Track['id']; context?: Embed['loadContext']; isResize?: boolean };

export const handlers = (store: AppStore) => ({
  'EMBED:REQUEST_LOAD': ({ trackId, context, isResize = false }: EmbedContext) => {
    store.setState((state) => {
      const loadedTrack = state.embed.trackId;
      log('request load', trackId, context);

      if (isResize) {
        return { embed: { ...state.embed, trackId: loadedTrack, status: EmbedStatus.LoadRequested } };
      }

      if (!trackId || loadedTrack === trackId) {
        return state;
      }

      switch (state.embed.status) {
        case EmbedStatus.Loaded:
        case EmbedStatus.Idle:
        case EmbedStatus.Paused:
        case EmbedStatus.PlaybackComplete:
        case EmbedStatus.PlayRequested:
        case EmbedStatus.Playing:
          return { embed: { ...state.embed, trackId, loadContext: context, status: EmbedStatus.LoadRequested } };
        default:
          return state;
      }
    });
  },
  'EMBED:MEDIA_LOADED': () => {
    store.setState((state) => {
      if (state.embed.status === EmbedStatus.LoadRequested) {
        return { embed: { ...state.embed, status: EmbedStatus.Loaded } };
      }

      return state;
    });
  },
  'EMBED:REQUEST_PLAY': () => {
    store.setState((state) => {
      const loadedTrack = state.embed.trackId;
      log('request play', state.embed.status);

      if (loadedTrack && [EmbedStatus.Loaded, EmbedStatus.Paused].includes(state.embed.status)) {
        return { embed: { ...state.embed, status: EmbedStatus.PlayRequested } };
      }
      return state;
    });
  },
  'EMBED:MEDIA_PLAYING': () => {
    store.setState((state) => {
      if ([EmbedStatus.PlayRequested, EmbedStatus.Paused].includes(state.embed.status)) {
        return { embed: { ...state.embed, status: EmbedStatus.Playing } };
      }

      return state;
    });
  },
  'EMBED:REQUEST_PAUSE': () => {
    store.setState((state) => {
      if (state.embed.status === EmbedStatus.Playing) {
        return { embed: { ...state.embed, status: EmbedStatus.PauseRequested } };
      }

      return state;
    });
  },
  'EMBED:MEDIA_PAUSED': () => {
    log('media paused');
    store.setState((state) => {
      if ([EmbedStatus.PauseRequested, EmbedStatus.Playing].includes(state.embed.status)) {
        return { embed: { ...state.embed, status: EmbedStatus.Paused } };
      }

      return state;
    });
  },
  'EMBED:MEDIA_PLAYBACK_COMPLETE': () => {
    log('media playback complete');
    store.setState((state) => {
      if ([EmbedStatus.Playing].includes(state.embed.status)) {
        return { embed: { ...state.embed, status: EmbedStatus.PlaybackComplete } };
      }

      return state;
    });
  },
  'EMBED:MEDIA_PLAYBACK_ERROR': () => {
    log('media playback error');
    store.setState((state) => {
      if ([EmbedStatus.PauseRequested, EmbedStatus.PlayRequested, EmbedStatus.Playing].includes(state.embed.status)) {
        return { embed: { ...state.embed, status: EmbedStatus.Loaded } };
      }

      return state;
    });
  },
  'EMBED:MEDIA_LOAD_ERROR': () => {
    log('media load error');
    store.setState((state) => {
      if ([EmbedStatus.LoadRequested].includes(state.embed.status)) {
        return { embed: { ...state.embed, status: EmbedStatus.Idle } };
      }

      return state;
    });
  },
  'EMBED:AUTOPLAY_TOGGLED': (autoplayEnabled: Embed['autoplayEnabled']) => {
    store.setState((state) => ({
      embed: {
        ...state.embed,
        autoplayEnabled,
      },
    }));
  },
  'EMBED:RESET': () => {
    store.setState(() => ({
      embed: initialState,
    }));
  },
});

export const loadAndPlayTrack =
  ({ trackId, context }: EmbedContext): Thunk<AppState> =>
  async (dispatch, store) => {
    const initialEmbed = store.getState().embed;
    log('load', initialEmbed);
    const trackIsLoaded = initialEmbed?.status === EmbedStatus.Paused && trackId === initialEmbed.trackId;

    if (!trackIsLoaded) {
      log('load requested', { trackId, context });
      dispatch('EMBED:REQUEST_LOAD', { trackId, context });
    }
    dispatch('EMBED:REQUEST_PLAY');
  };

export const handleInit = (): Thunk<AppState> => async (dispatch, store) => {
  const { trackId, loadContext, status } = store.getState().embed as Embed;
  log('handleInit', trackId);
  dispatch('EMBED:RESET');
  if ([EmbedStatus.PlayRequested, EmbedStatus.Playing].includes(status)) {
    dispatch(loadAndPlayTrack({ trackId, context: loadContext }));
  } else {
    log('load requested', { trackId, context: loadContext });
    dispatch('EMBED:REQUEST_LOAD', { trackId, context: loadContext });
  }
};

export const selectTrackByEmbedLoaded =
  () =>
  (state: AppState): Track =>
    state.tracks.find((track) => track.id === state.embed.trackId) as Track;

export const selectNextTrack = (state: Partial<AppState>): Track['id'] | undefined => {
  const { embed } = state;
  const nextTrackFromContextSelector = () => {
    const params = {
      id: embed?.loadContext?.contextId as number,
      currentTrackId: embed?.trackId as number,
    };
    const nextTrackSelector =
      embed?.loadContext?.contextType === LoadContextType.Browser
        ? selectNextTrackOnMetaPanel(params)
        : getNextTrackOnList(params);
    return nextTrackSelector(state);
  };

  if (embed?.loadContext?.contextId !== undefined) {
    return nextTrackFromContextSelector();
  }

  return undefined;
};

export const selectPreviousTrack = (state: Partial<AppState>): Track['id'] | undefined => {
  const { embed } = state;
  const previousTrackFromContextSelector = () => {
    const params = {
      id: embed?.loadContext?.contextId as number,
      currentTrackId: embed?.trackId as number,
    };
    const previousTrackSelector =
      embed?.loadContext?.contextType === LoadContextType.Browser
        ? selectPreviousTrackOnMetaPanel(params)
        : getPreviousTrackOnList(params);
    return previousTrackSelector(state);
  };

  if (embed?.loadContext?.contextId !== undefined) {
    return previousTrackFromContextSelector();
  }

  return undefined;
};

export const loadAndPlayNextTrack = (): Thunk<AppState> => (dispatch, store) => {
  const state = store.getState();
  const nextTrackId = selectNextTrack(state);

  if (nextTrackId) {
    dispatch(loadAndPlayTrack({ trackId: nextTrackId, context: state.embed?.loadContext }));
  }
};

export const loadAndPlayPreviousTrack = (): Thunk<AppState> => (dispatch, store) => {
  const state = store.getState();
  const previousTrackId = selectPreviousTrack(state);

  if (previousTrackId) {
    dispatch(loadAndPlayTrack({ trackId: previousTrackId, context: state.embed?.loadContext }));
  }
};

export const selectAutoplayEnabled = (state: Partial<AppState>): boolean => !!state.embed?.autoplayEnabled;

export const trackIsPlaying =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: Partial<AppState>): boolean =>
    embed?.trackId === trackId && embed.status === EmbedStatus.Playing;

export const trackIsPaused =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: Partial<AppState>): boolean =>
    embed?.trackId === trackId && embed.status === EmbedStatus.Paused;

export const trackIsLoaded =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: Partial<AppState>): boolean =>
    embed?.trackId === trackId;

export const embedRequestInFlight =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: Partial<AppState>): boolean => {
    log('embedRequestInFlight', embed);
    return (
      !!embed?.status &&
      [(EmbedStatus.LoadRequested, EmbedStatus.PauseRequested, EmbedStatus.PlayRequested)].includes(embed.status) &&
      embed?.trackId === trackId
    );
  };
