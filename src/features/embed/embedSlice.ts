import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppState, Embed, Track, EmbedStatus, LoadContextType, AppThunk, Dispatch } from '../../common/types';
import { log } from '../../main/helpers/console';
import { getNextTrackOnMetaPanel } from '../browsers/browsersSlice';
import { getNextTrackOnList } from '../lists/listsSlice';

const initialState = {
  status: EmbedStatus.Idle,
  autoplayEnabled: true,
} as Embed;

type EmbedContext = { trackId?: Track['id']; context?: Embed['loadContext']; isResize?: boolean };

export const slice = createSlice({
  name: 'embed',
  initialState,
  reducers: {
    requestLoad: (state, { payload: { trackId, context, isResize = false } }: { payload: EmbedContext }) => {
      const loadedTrack = state.trackId;
      log('request load', trackId, context);

      if (isResize) {
        return { ...state, trackId: loadedTrack, status: EmbedStatus.LoadRequested };
      }

      if (!trackId || loadedTrack === trackId) {
        return state;
      }

      switch (state.status) {
        case EmbedStatus.Loaded:
        case EmbedStatus.Idle:
        case EmbedStatus.Paused:
        case EmbedStatus.Playing:
          return { ...state, trackId, loadContext: context, status: EmbedStatus.LoadRequested };
        default:
          return state;
      }
    },
    mediaLoaded: (state) => {
      if (state.status === EmbedStatus.LoadRequested) {
        return { ...state, status: EmbedStatus.Loaded };
      }

      return state;
    },
    requestPlay: (state) => {
      const loadedTrack = state.trackId;
      log('request play', state.status);

      if (loadedTrack && [EmbedStatus.Loaded, EmbedStatus.Paused].includes(state.status)) {
        return { ...state, status: EmbedStatus.PlayRequested };
      }
      return state;
    },
    mediaPlaying: (state) => {
      if ([EmbedStatus.PlayRequested, EmbedStatus.Paused].includes(state.status)) {
        return { ...state, status: EmbedStatus.Playing };
      }

      return state;
    },
    requestPause: (state) => {
      if (state.status === EmbedStatus.Playing) {
        return { ...state, status: EmbedStatus.PauseRequested };
      }

      return state;
    },
    mediaPaused: (state) => {
      log('media paused');
      if ([EmbedStatus.PauseRequested, EmbedStatus.Playing].includes(state.status)) {
        return { ...state, status: EmbedStatus.Paused };
      }

      return state;
    },
    autoplayEnabledToggled: (state, { payload: autoplayEnabled }: { payload: Embed['autoplayEnabled'] }) => ({
      ...state,
      autoplayEnabled,
    }),
    reset: () => initialState,
  },
});

export const {
  requestLoad,
  mediaLoaded,
  requestPlay,
  mediaPlaying,
  requestPause,
  mediaPaused,
  autoplayEnabledToggled,
  reset,
} = slice.actions;

type ThunkApi = {
  dispatch: Dispatch;
  state: AppState;
};

export const loadTrack = createAsyncThunk<void, EmbedContext, ThunkApi>(
  'tracks/loadTrack',
  async ({ trackId, context }: EmbedContext, { dispatch, getState }) => {
    log('load requested', { trackId, context });
    dispatch(requestLoad({ trackId, context }));
    if (getState().embed.status === EmbedStatus.LoadRequested) {
      await window.api.invoke('load-track', trackId);
    }
  },
);

// export const loadTrack =
//   ({ trackId, context }: EmbedContext): AppThunk =>
//   (dispatch, getState) => {
//     log('load requested', { trackId, context });
//     dispatch(requestLoad({ trackId, context }));
//     if (getState().embed.status === EmbedStatus.LoadRequested) {
//       void (async () => {
//         await window.api.invoke('load-track', trackId);
//       });
//     }
//   };

export const playTrack = createAsyncThunk<void, undefined, ThunkApi>(
  'tracks/playTrack',
  async (_empty, { dispatch, getState }) => {
    dispatch(requestPlay());
    if (getState().embed.status === EmbedStatus.PlayRequested) {
      await window.api.invoke('play-track');
    }
  },
);

// export const playTrack = (): AppThunk => (dispatch, getState) => {
//   dispatch(requestPlay());
//   if (getState().embed.status === EmbedStatus.PlayRequested) {
//     void (async () => {
//       await window.api.invoke('play-track');
//     });
//   }
// };

export const pauseTrack = createAsyncThunk<void, undefined, ThunkApi>(
  'tracks/pauseTrack',
  async (_empty, { dispatch, getState }) => {
    dispatch(requestPause());
    if (getState().embed.status === EmbedStatus.PauseRequested) {
      await window.api.invoke('pause-track');
    }
  },
);

export const loadAndPlayTrack =
  ({ trackId, context }: EmbedContext): AppThunk =>
  async (dispatch, getState) => {
    const initialEmbed = getState().embed;
    log('load', initialEmbed);
    const trackIsLoaded = initialEmbed.status === EmbedStatus.Paused && trackId === initialEmbed.trackId;

    if (!trackIsLoaded) {
      await dispatch(loadTrack({ trackId, context }));
    }
    await dispatch(playTrack());
  };

export const resizeEmbed = (): AppThunk => async (dispatch, getState) => {
  const initialStatus = getState().embed.status;
  dispatch(requestLoad({ isResize: true }));
  const embedState = getState().embed;
  if (embedState.status === EmbedStatus.LoadRequested) {
    await window.api.invoke('load-track', embedState.trackId);
    await window.api.invoke('resize-browsers');
    if (initialStatus === EmbedStatus.Playing) {
      await dispatch(playTrack());
    }
  }
};

export const loadAndPlayNextTrack = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { loadContext, trackId } = state.embed;
  const nextTrackFromContextSelector = () => {
    const params = {
      id: loadContext?.contextId as number,
      currentTrackId: trackId as number,
    };
    const nextTrackSelector =
      loadContext?.contextType === LoadContextType.Browser
        ? getNextTrackOnMetaPanel(params)
        : getNextTrackOnList(params);
    return nextTrackSelector(state);
  };

  if (loadContext && loadContext.contextId !== undefined) {
    const nextTrackId = nextTrackFromContextSelector();
    if (nextTrackId) {
      dispatch(loadAndPlayTrack({ trackId: nextTrackId, context: loadContext }));
    }
  }
};

export const handleAutoplay = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const { trackId, autoplayEnabled } = state.embed;
  log('handleAutoplay', autoplayEnabled, trackId);
  if (autoplayEnabled && trackId) {
    dispatch(loadAndPlayNextTrack());
  }
};

export const handleInit = (): AppThunk => async (dispatch, getState) => {
  const { trackId, loadContext, status } = getState().embed;
  log('handleInit', trackId);
  dispatch(reset());
  if ([EmbedStatus.PlayRequested, EmbedStatus.Playing].includes(status)) {
    dispatch(loadAndPlayTrack({ trackId, context: loadContext }));
  } else {
    await dispatch(loadTrack({ trackId, context: loadContext }));
  }
};

export const selectTrackByEmbedLoaded =
  () =>
  (state: AppState): Track =>
    state.tracks.find((track) => track.id === state.embed.trackId) as Track;

export const selectAutoplayEnabled = (state: AppState): boolean => state.embed.autoplayEnabled;

export const trackIsPlaying =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.trackId === trackId && embed.status === EmbedStatus.Playing;

export const trackIsPaused =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.trackId === trackId && embed.status === EmbedStatus.Paused;

export const trackIsLoaded =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.trackId === trackId;

export const embedRequestInFlight =
  () =>
  ({ embed }: AppState): boolean => {
    log('embedRequestInFlight', embed);
    return [EmbedStatus.LoadRequested, EmbedStatus.PauseRequested, EmbedStatus.PlayRequested].includes(embed.status);
  };

export const embedReducer = slice.reducer;
