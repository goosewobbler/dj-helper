import { createSlice } from '@reduxjs/toolkit';
import { AppState, Track, TrackSource } from '../../common/types';
import { log } from '../../main/helpers/console';

const initialState: Track[] = [];

export type TrackData = {
  id?: Track['id'];
  title: Track['title'];
  artist: Track['artist'];
  duration: Track['duration'];
  browserId: Track['browserId'];
  sourceId: TrackSource['sourceId'];
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
  track.sources.findIndex((source) => source.url === url);

function getUpdatedTrackSources(
  trackToUpdate: Track,
  sourceId: TrackSource['sourceId'],
  url: TrackSource['url'],
  price: TrackSource['price'],
  priceCurrency: TrackSource['priceCurrency'],
) {
  const trackSourceDupeIndex = getTrackSourceDuplicate(trackToUpdate, url);
  if (trackSourceDupeIndex) {
    // update price
    return trackToUpdate.sources.map((source, index) =>
      index === trackSourceDupeIndex ? { ...source, sourceId, price, priceCurrency } : source,
    );
  }
  const newTrackSource: TrackSource = {
    url,
    sourceId,
    price,
    priceCurrency,
  };
  return [...trackToUpdate.sources, newTrackSource];
}

function updateTrackData(
  track: Track,
  { browserId, title, artist, duration, sourceId, url, price, priceCurrency }: TrackData,
): Track {
  const trackToUpdate = { ...track };
  log('updating track', trackToUpdate);
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
    trackToUpdate.sources = getUpdatedTrackSources(trackToUpdate, sourceId, url, price, priceCurrency);
  }
  return trackToUpdate;
}

export const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    createTrack: (
      state,
      { payload: { title, artist, duration, browserId, sourceId, url, price, priceCurrency } }: { payload: TrackData },
    ) => {
      const dupe = getTrackDuplicate(state, title, artist, duration);
      if (dupe) {
        log('found track dupe');

        return state.map((track) =>
          track.id === dupe.id
            ? { ...track, browserId, sources: getUpdatedTrackSources(track, sourceId, url, price, priceCurrency) }
            : track,
        );
      }
      const newTrack: Track = {
        id: state.length + 1,
        title,
        artist,
        duration,
        browserId,
        sources: [
          {
            sourceId,
            url,
            price,
            priceCurrency,
          },
        ],
      };
      return [...state, newTrack];
    },
    updateTrack: (state, { payload }: { payload: TrackData }) =>
      state.map((track) => {
        if (track.id === payload.id) {
          return updateTrackData(track, payload);
        }
        return track;
      }),
    deleteTrack: (state, { payload: { id } }) =>
      state.filter((track) => track.id === id).map((track, index) => ({ ...track, index })),
    unlinkBrowserFromTracks: (state, { payload: { browserId } }) =>
      state.map((track) => (track.browserId === browserId ? { ...track, browserId: undefined } : track)),
  },
});

export const { createTrack, updateTrack, deleteTrack, unlinkBrowserFromTracks } = slice.actions;

export const selectTracks = (state: AppState): Track[] => {
  log('track selector returning', state);
  return state.tracks;
};

export const tracksReducer = slice.reducer;
