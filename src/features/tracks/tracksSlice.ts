import { createSlice } from '@reduxjs/toolkit';
import { AppState, Track, TrackSource } from '../../common/types';
import { log } from '../../main/helpers/console';

const initialState: Track[] = [];

export type TrackData = {
  id?: Track['id'];
  title: Track['title'];
  artist: Track['artist'];
  duration: Track['duration'];
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
  { title, artist, duration, sourceId, url, price, priceCurrency }: TrackData,
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
  if (url) {
    trackToUpdate.sources = getUpdatedTrackSources(trackToUpdate, sourceId, url, price, priceCurrency);
  }
  return trackToUpdate;
}

function trackHasSource(track: Track, sourceUrl: string, sourceId?: number): boolean {
  return !!track.sources.find((trackSource) => {
    if (sourceId) {
      return trackSource.sourceId === sourceId;
    }
    return trackSource.url.includes(sourceUrl);
  });
}

export const slice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    createTrack: (
      state,
      { payload: { title, artist, duration, sourceId, url, price, priceCurrency } }: { payload: TrackData },
    ) => {
      const dupe = getTrackDuplicate(state, title, artist, duration);
      if (dupe) {
        log('found track dupe');

        return state.map((track) =>
          track.id === dupe.id
            ? { ...track, sources: getUpdatedTrackSources(track, sourceId, url, price, priceCurrency) }
            : track,
        );
      }
      const newTrack: Track = {
        id: state.length + 1,
        title,
        artist,
        duration,
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
    clearAllTracks: () => initialState,
  },
});

export const { createTrack, updateTrack, deleteTrack, clearAllTracks } = slice.actions;

export const selectTrackById =
  (id: Track['id']) =>
  (state: AppState): Track =>
    state.tracks.find((track) => track.id === id) as Track;

export const selectTrackBySourceUrl =
  (sourceUrl: TrackSource['url']) =>
  (state: AppState): Track =>
    state.tracks.find((track) => trackHasSource(track, sourceUrl)) as Track;

export const tracksReducer = slice.reducer;
