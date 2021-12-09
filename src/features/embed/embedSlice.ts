import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk, Embed, Track, EmbedStatus, LoadContextType } from '../../common/types';
import { log } from '../../main/helpers/console';
import { getNextTrackOnMetaPanel } from '../browsers/browsersSlice';
import { getNextTrackOnList } from '../lists/listsSlice';

const initialState = {
  status: EmbedStatus.Idle,
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
    reset: () => initialState,
  },
});

export const { requestLoad, mediaLoaded, requestPlay, mediaPlaying, requestPause, mediaPaused, reset } = slice.actions;

export const loadTrack =
  ({ trackId, context }: EmbedContext): AppThunk =>
  async (dispatch, getState) => {
    log('load requested', { trackId, context });
    dispatch(requestLoad({ trackId, context }));
    if (getState().embed.status === EmbedStatus.LoadRequested) {
      await window.api.invoke('load-track', trackId);
    }
    return Promise.resolve();
  };

export const playTrack = (): AppThunk => async (dispatch, getState) => {
  dispatch(requestPlay());
  if (getState().embed.status === EmbedStatus.PlayRequested) {
    await window.api.invoke('play-track');
  }
  return Promise.resolve();
};

export const pauseTrack = (): AppThunk => async (dispatch, getState) => {
  dispatch(requestPause());
  if (getState().embed.status === EmbedStatus.PauseRequested) {
    await window.api.invoke('pause-track');
  }
  return Promise.resolve();
};

export const loadAndPlayTrack =
  ({ trackId, context }: EmbedContext): AppThunk =>
  async (dispatch, getState) => {
    const initialEmbed = getState().embed;
    log('load', initialEmbed);
    if (initialEmbed.status === EmbedStatus.Paused && trackId === initialEmbed.trackId) {
      // play a track which is already loaded
      return dispatch(playTrack());
    }

    await dispatch(loadTrack({ trackId, context }));
    return dispatch(playTrack());
  };

export const resizeEmbed = (): AppThunk => async (dispatch, getState) => {
  const initialStatus = getState().embed.status;
  dispatch(requestLoad({ isResize: true }));
  const embedState = getState().embed;
  if (embedState.status === EmbedStatus.LoadRequested) {
    await window.api.invoke('load-track', embedState.trackId);
    await window.api.invoke('resize-browsers');
    if (initialStatus === EmbedStatus.Playing) {
      dispatch(playTrack());
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
  log('loadAndPlayNextTrack', loadContext);
  if (loadContext && loadContext.contextId) {
    const nextTrackId = nextTrackFromContextSelector();
    dispatch(loadAndPlayTrack({ trackId: nextTrackId, context: loadContext }));
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

export const handleInit = (): AppThunk => (dispatch, getState) => {
  const { trackId, loadContext, status } = getState().embed;
  log('handleInit', trackId);
  dispatch(reset());
  if ([EmbedStatus.PlayRequested, EmbedStatus.Playing].includes(status)) {
    dispatch(loadAndPlayTrack({ trackId, context: loadContext }));
  } else {
    dispatch(loadTrack({ trackId, context: loadContext }));
  }
};

export const selectTrackByEmbedLoaded =
  () =>
  (state: AppState): Track =>
    state.tracks.find((track) => track.id === state.embed.trackId) as Track;

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
