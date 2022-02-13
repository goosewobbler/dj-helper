import { createSlice } from '@reduxjs/toolkit';
import { AppState, List, Track } from '../../common/types';

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

export const slice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    createList: (state) => {
      const newList: List = {
        id: state.length,
        title: initialListTitle,
        tracks: [],
        editing: true,
        active: true,
      };
      return [...state.map((list) => ({ ...list, active: false })), newList];
    },
    updateListTitle: (state, { payload: { id, title } }: { payload: { id: number; title: string } }) =>
      state.map((list) => (list.id === id ? { ...list, title } : list)),
    deleteList: (state, { payload: { id } }) =>
      state.filter((list) => list.id !== id).map((list, index) => ({ ...list, id: index })),
    editList: (state, { payload: { id } }) =>
      state.map((list) => (list.id === id ? { ...list, editing: true, oldTitle: list.title } : list)),
    finishEditList: (state) =>
      state.map((list) => (list.editing === true ? { ...list, editing: undefined, oldTitle: undefined } : list)),
    revertEditList: (state) =>
      state.map((list) =>
        list.editing === true
          ? { ...list, editing: undefined, title: list.oldTitle ?? initialListTitle, oldTitle: undefined }
          : list,
      ),
    toggleListActive: (state, { payload: { id } }: { payload: { id: number } }) =>
      state.map((list) => (list.id === id ? { ...list, active: !list.active } : { ...list, active: false })),
    addTrackToActiveList: (state, { payload: { trackId } }: { payload: { trackId: number } }) =>
      state.map((list) => (list.active ? { ...list, tracks: [...list.tracks, trackId] } : list)),
    removeTrackFromActiveList: (state, { payload: { trackId } }: { payload: { trackId: number } }) =>
      state.map((list) => (list.active ? { ...list, tracks: list.tracks.filter((track) => track !== trackId) } : list)),
    moveTrackToIndex: (state, { payload: { trackId, newIndex } }: { payload: { trackId: number; newIndex: number } }) =>
      state.map((list) => (list.active ? { ...list, tracks: reorderTracks(list.tracks, trackId, newIndex) } : list)),
  },
});

export const {
  createList,
  deleteList,
  updateListTitle,
  editList,
  revertEditList,
  finishEditList,
  toggleListActive,
  addTrackToActiveList,
  removeTrackFromActiveList,
  moveTrackToIndex,
} = slice.actions;

export const selectLists = (state: AppState): List[] => state.lists;

export const selectActiveList = (state: AppState): List | undefined => state.lists.find((list) => list.active);

export const selectListById =
  (id: number) =>
  (state: AppState): List =>
    state.lists.find((list) => list.id === id) as List;

export const trackIsOnActiveList =
  ({ trackId }: { trackId: number }) =>
  (state: AppState): boolean =>
    (state.lists.find((list) => list.active) as List)?.tracks.some((track) => track === trackId);

export const getNextTrackOnList =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: AppState): Track['id'] | undefined => {
    const list = state.lists.find((stateList) => stateList.id === id) as List;
    const listTracks = (state.lists.find((stateList) => stateList.id === id) as List).tracks;
    if (!list) {
      return undefined;
    }
    const currentTrackIndex = list.tracks.findIndex((track) => track === currentTrackId);
    return listTracks[currentTrackIndex + 1];
  };

export const getPreviousTrackOnList =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: AppState): Track['id'] | undefined => {
    const list = state.lists.find((stateList) => stateList.id === id) as List;
    const listTracks = (state.lists.find((stateList) => stateList.id === id) as List).tracks;
    if (!list) {
      return undefined;
    }
    const currentTrackIndex = listTracks.findIndex((track) => track === currentTrackId);
    return listTracks[currentTrackIndex - 1];
  };

export const listsReducer = slice.reducer;

export const reducers = slice.caseReducers;
