import { log } from '../../main/helpers/console.js';
import type { AppState, AppStore, Track, TrackSource } from '../../common/types.js';

export const initialState: Track[] = [];

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
  if (trackSourceDupeIndex > -1) {
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
    return trackSource.url === sourceUrl;
  });
}

export const handlers = (store: AppStore) => ({
  'TRACK:CREATE': ({ title, artist, duration, sourceId, url, price, priceCurrency }: TrackData) => {
    return store.setState((state) => {
      const dupe = getTrackDuplicate(state.tracks, title, artist, duration);
      if (dupe) {
        log('found track dupe');

        return {
          tracks: state.tracks.map((track) =>
            track.id === dupe.id
              ? { ...track, sources: getUpdatedTrackSources(track, sourceId, url, price, priceCurrency) }
              : track,
          ),
        };
      }
      const newTrack: Track = {
        id: state.tracks.length + 1,
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
      return {
        tracks: [...state.tracks, newTrack],
      };
    });
  },
  'TRACK:UPDATE': (payload: TrackData) =>
    store.setState((state) => ({
      tracks: state.tracks.map((track) => {
        if (track.id === payload.id) {
          return updateTrackData(track, payload);
        }
        return track;
      }),
    })),
  'TRACK:DELETE': (payload: TrackData) =>
    store.setState((state) => ({
      tracks: state.tracks.filter((track) => track.id === payload.id).map((track, index) => ({ ...track, index })),
    })),
});

export const selectTrackById =
  (id: Track['id']) =>
  (state: Partial<AppState>): Track =>
    state.tracks?.find((track) => track.id === id) as Track;

export const selectTrackBySourceUrl =
  (sourceUrl: TrackSource['url']) =>
  (state: Partial<AppState>): Track =>
    state.tracks?.find((track) => trackHasSource(track, sourceUrl)) as Track;

export const selectTrackSourceByIndex =
  (trackId: Track['id'], index: number) =>
  (state: Partial<AppState>): TrackSource =>
    state.tracks?.find((track) => track.id === trackId)?.sources[index] as TrackSource;
