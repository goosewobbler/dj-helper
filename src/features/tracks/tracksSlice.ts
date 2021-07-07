import { createSlice } from '@reduxjs/toolkit';
import { AppState, Track, TrackSource } from '../../common/types';

const initialState: Track[] = [];

export type TrackData = {
  title: Track['title'];
  artist: Track['artist'];
  duration: Track['duration'];
  url: TrackSource['url'];
  price?: TrackSource['price'];
  priceCurrency: TrackSource['url'];
};

export const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    createTrack: (state, { payload: { title, artist, duration, url, price, priceCurrency } }) => {
      const newTrackSource: TrackSource = {
        url,
        price,
        priceCurrency,
      };
      const newTrack: Track = {
        id: state.length + 1,
        title,
        artist,
        duration,
        sources: [newTrackSource],
      };
      state.push(newTrack);
    },
    updateTrack: (state, { payload: { id, title, artist, duration, url, price, priceCurrency } }) => {
      const trackToUpdate = state.find((list) => list.id === id);
      if (trackToUpdate) {
        if (title) {
          trackToUpdate.title = title;
        }
        if (artist) {
          trackToUpdate.artist = artist;
        }
        if (duration) {
          trackToUpdate.duration = duration;
        }
        if (url) {
          const newTrackSource: TrackSource = {
            url,
            price,
            priceCurrency,
          };
          trackToUpdate.sources.push(newTrackSource);
        }
      }
    },
    deleteTrack: (state, { payload }) => {
      const indexToRemove = state.findIndex((track) => track.id === payload);
      if (indexToRemove > -1) {
        // remove
        state.splice(indexToRemove, 1);
        // reorder ids
        state.slice(indexToRemove).forEach((track) => {
          track.id -= 1;
        });
      }
    },
  },
});

export const { createTrack, updateTrack } = slice.actions;

export const selectTracks = (state: AppState): Track[] => state.tracks;

export const tracksReducer = slice.reducer;
