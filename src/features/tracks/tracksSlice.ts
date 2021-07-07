import { createSlice } from '@reduxjs/toolkit';
import { AppState, Track, TrackSource } from '../../common/types';
import { log } from '../../main/helpers/console';

const initialState: Track[] = [];

export type TrackData = {
  title: Track['title'];
  artist: Track['artist'];
  duration: Track['duration'];
  browserId: Track['browserId'];
  url: TrackSource['url'];
  price?: TrackSource['price'];
  priceCurrency: TrackSource['priceCurrency'];
};

const getTrackDuplicate = (
  state: Track[],
  title: Track['title'],
  artist: Track['artist'],
  duration: Track['duration'],
) => state.find((track: Track) => track.title === title && track.artist === artist && track.duration === duration);

const getTrackSourceDuplicate = (track: Track, url: TrackSource['url']) =>
  track.sources.find((source) => source.url === url);

function addTrackSource(
  trackToUpdate: Track,
  url: TrackSource['url'],
  price: TrackSource['price'],
  priceCurrency: TrackSource['priceCurrency'],
) {
  const newTrackSource: TrackSource = {
    url,
    price,
    priceCurrency,
  };

  trackToUpdate.sources.push(newTrackSource);
}

function updateTrackSources(
  trackToUpdate: Track,
  url: TrackSource['url'],
  price: TrackSource['price'],
  priceCurrency: TrackSource['priceCurrency'],
) {
  const trackSourceDupe = getTrackSourceDuplicate(trackToUpdate, url);
  if (trackSourceDupe) {
    trackSourceDupe.price = price;
    trackSourceDupe.priceCurrency = priceCurrency;
  } else {
    addTrackSource(trackToUpdate, url, price, priceCurrency);
  }
}

export const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    createTrack: (state, { payload: { title, artist, duration, browserId, url, price, priceCurrency } }) => {
      let trackToUpdate = getTrackDuplicate(state, title, artist, duration);
      if (trackToUpdate) {
        log('found track dupe, updating track sources');
        updateTrackSources(trackToUpdate, url, price, priceCurrency);
      } else {
        const newTrack = {
          id: state.length + 1,
          title,
          artist,
          duration,
          browserId,
          sources: [],
        };
        addTrackSource(newTrack, url, price, priceCurrency);
        log('creating new track', newTrack);
        state.push(newTrack);
      }
    },
    updateTrack: (state, { payload: { id, browserId, title, artist, duration, url, price, priceCurrency } }) => {
      const trackToUpdate = state.find((track) => track.id === id);
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
        if (browserId) {
          trackToUpdate.browserId = browserId;
        }
        if (url) {
          updateTrackSources(trackToUpdate, url, price, priceCurrency);
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
    unlinkBrowserFromTracks: (state, { payload: { browserId } }) => {
      log('unlinking tracks', browserId);
      state.filter((track) => track.browserId === browserId).forEach((track) => delete track.browserId);
    },
  },
});

export const { createTrack, updateTrack, deleteTrack, unlinkBrowserFromTracks } = slice.actions;

export const selectTracks = (state: AppState): Track[] => {
  log('track selector returning', state);
  return state.tracks;
};

export const tracksReducer = slice.reducer;
