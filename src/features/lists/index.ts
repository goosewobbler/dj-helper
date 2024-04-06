import type { AppState, AppStore, List, Track } from '../../common/types.js';

const initialListTitle = 'New List';

function reorderTracks(tracks: List['tracks'], trackIdToMove: Track['id'], newIndex: number) {
  const indexOfTrackIdToMove = tracks.indexOf(trackIdToMove);
  if (indexOfTrackIdToMove === -1) {
    return tracks;
  }

  // clone array and remove track
  const otherTracks = Array.from(tracks);
  otherTracks.splice(indexOfTrackIdToMove, 1);

  // insert track at the desired index
  const tracksBefore = otherTracks.slice(0, newIndex);
  const tracksAfter = otherTracks.slice(newIndex);
  return tracksBefore.concat([trackIdToMove]).concat(tracksAfter);
}

export const initialState: List[] = [
  {
    id: 0,
    title: 'Look a set list',
    tracks: [],
    editing: false,
    active: true,
  },
  {
    id: 1,
    title: 'Wow such list',
    tracks: [],
    editing: false,
    active: false,
  },
];

export const handlers = (store: AppStore) => ({
  'LIST:CREATE': () => {
    store.setState((state) => {
      const newList: List = {
        id: state.lists.length,
        title: initialListTitle,
        tracks: [],
        editing: true,
        active: true,
      };
      return { lists: [...state.lists.map((list) => ({ ...list, active: false })), newList] };
    });
  },
  'LIST:UPDATE_TITLE': ({ id, title }: { id: number; title: string }) =>
    store.setState((state) => ({
      lists: state.lists.map((list) => (list.id === id ? { ...list, title } : list)),
    })),
  'LIST:DELETE': ({ id }: { id: number }) =>
    store.setState((state) => ({
      lists: state.lists.filter((list) => list.id !== id).map((list, index) => ({ ...list, id: index })),
    })),
  'LIST:EDIT': ({ id }: { id: number }) =>
    store.setState((state) => ({
      lists: state.lists.map((list) => (list.id === id ? { ...list, editing: true, oldTitle: list.title } : list)),
    })),
  'LIST:EDIT_COMPLETE': () =>
    store.setState((state) => ({
      lists: state.lists.map((list) =>
        list.editing === true ? { ...list, editing: undefined, oldTitle: undefined } : list,
      ),
    })),
  'LIST:EDIT_REVERT': () =>
    store.setState((state) => ({
      lists: state.lists.map((list) =>
        list.editing === true
          ? { ...list, editing: undefined, title: list.oldTitle ?? initialListTitle, oldTitle: undefined }
          : list,
      ),
    })),
  'LIST:TOGGLE_ACTIVE': ({ id }: { id: number }) =>
    store.setState((state) => ({
      lists: state.lists.map((list) =>
        list.id === id ? { ...list, active: !list.active } : { ...list, active: false },
      ),
    })),
  'LIST:ADD_TRACK': ({ trackId }: { trackId: number }) =>
    store.setState((state) => ({
      lists: state.lists.map((list) => (list.active ? { ...list, tracks: [...list.tracks, trackId] } : list)),
    })),
  'LIST:REMOVE_TRACK': ({ trackId }: { trackId: number }) =>
    store.setState((state) => ({
      lists: state.lists.map((list) =>
        list.active ? { ...list, tracks: list.tracks.filter((track) => track !== trackId) } : list,
      ),
    })),
  'LIST:MOVE_TRACK': ({ trackId, newIndex }: { trackId: number; newIndex: number }) =>
    store.setState((state) => ({
      lists: state.lists.map((list) =>
        list.active ? { ...list, tracks: reorderTracks(list.tracks, trackId, newIndex) } : list,
      ),
    })),
});

export const selectLists = (state: Partial<AppState>) => state.lists as List[];

export const selectActiveList = (state: Partial<AppState>): List => state.lists?.find((list) => list.active) as List;

export const selectListById =
  (id: number) =>
  (state: Partial<AppState>): List =>
    state.lists?.find((list) => list.id === id) as List;

export const trackIsOnActiveList =
  ({ trackId }: { trackId: number }) =>
  (state: Partial<AppState>): boolean =>
    (state.lists?.find((list) => list.active) as List)?.tracks.some((track) => track === trackId);

export const getNextTrackOnList =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: Partial<AppState>): Track['id'] | undefined => {
    const list = state.lists?.find((stateList) => stateList.id === id) as List;
    const listTracks = (state.lists?.find((stateList) => stateList.id === id) as List).tracks;
    if (!list) {
      return undefined;
    }
    const currentTrackIndex = list.tracks.findIndex((track) => track === currentTrackId);
    return listTracks[currentTrackIndex + 1];
  };

export const getPreviousTrackOnList =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: Partial<AppState>): Track['id'] | undefined => {
    const list = state.lists?.find((stateList) => stateList.id === id) as List;
    const listTracks = (state.lists?.find((stateList) => stateList.id === id) as List).tracks;
    if (!list) {
      return undefined;
    }
    const currentTrackIndex = listTracks.findIndex((track) => track === currentTrackId);
    return listTracks[currentTrackIndex - 1];
  };
