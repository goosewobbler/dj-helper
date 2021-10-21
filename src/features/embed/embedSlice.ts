import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk, Embed, Track, EmbedStatus } from '../../common/types';
import { log } from '../../main/helpers/console';

const initialState = {
  status: EmbedStatus.Idle,
} as Embed;

type EmbedContext = { trackId?: Track['id']; context: Embed['trackContext'] };

export const slice = createSlice({
  name: 'embed',
  initialState,
  reducers: {
    requestLoad: (state, { payload: { trackId, context } }: { payload: EmbedContext }) => {
      const loadedTrack = state.trackId;
      const isResize = context === 'resize';
      log('request load', trackId, context);

      if (isResize) {
        return { ...state, trackId: loadedTrack, trackContext: 'resize', status: EmbedStatus.LoadRequested };
      }

      if (!trackId || loadedTrack === trackId) {
        return state;
      }

      switch (state.status) {
        case EmbedStatus.Loaded:
        case EmbedStatus.Idle:
        case EmbedStatus.Paused:
        case EmbedStatus.Playing:
          return { ...state, trackId, trackContext: context, status: EmbedStatus.LoadRequested };
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
      log('request play', state);

      if (loadedTrack && state.status === EmbedStatus.Loaded) {
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
      if (state.status === EmbedStatus.PauseRequested) {
        return { ...state, status: EmbedStatus.Paused };
      }

      return state;
    },
  },
});

export const { requestLoad, mediaLoaded, requestPlay, mediaPlaying, requestPause, mediaPaused } = slice.actions;

export const pauseTrack = (): AppThunk => async (dispatch, getState) => {
  dispatch(requestPause());
  if (getState().embed.status === EmbedStatus.PauseRequested) {
    await window.api.invoke('pause-track');
  }
};

export const loadAndPlayTrack =
  ({ trackId, context }: EmbedContext): AppThunk =>
  async (dispatch, getState) => {
    dispatch(requestLoad({ trackId, context }));
    if (getState().embed.status === EmbedStatus.LoadRequested) {
      await window.api.invoke('load-track', trackId);
      log('loaded yo', getState().embed);
      if (getState().embed.status === EmbedStatus.Loaded) {
        dispatch(requestPlay());
        await window.api.invoke('play-track');
      }
    }
  };

export const resizeEmbed = (): AppThunk => async (dispatch, getState) => {
  dispatch(requestLoad({ context: 'resize' }));
  const embedState = getState().embed;
  if (embedState.status === EmbedStatus.LoadRequested) {
    await window.api.invoke('load-track', embedState.trackId);
    await window.api.invoke('resize-browsers');
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
  ({ embed }: AppState): boolean =>
    [EmbedStatus.LoadRequested, EmbedStatus.PauseRequested, EmbedStatus.PlayRequested].includes(embed.status);

export const embedReducer = slice.reducer;
