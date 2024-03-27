import React from 'react';

import { useAppDispatch, useAppSelector } from '../../common/hooks.js';
import { LoadContext, Track } from '../../common/types.js';
import {
  addTrackToActiveList,
  removeTrackFromActiveList,
  selectActiveList,
  trackIsOnActiveList,
} from '../lists/listsSlice.js';
import { AddRemoveListButton } from './AddRemoveListButton.js';
import { BaseTrack } from './BaseTrack.js';

export function BrowserTrack({ id, context }: { id: Track['id']; context: LoadContext }) {
  const dispatch = useAppDispatch();
  const hasActiveList = !!useAppSelector(selectActiveList);
  const isOnSelectedList = useAppSelector(trackIsOnActiveList({ trackId: id }));

  return (
    <BaseTrack
      id={id}
      context={context}
      additionalButtons={
        hasActiveList ? (
          <AddRemoveListButton
            isOnSelectedList={isOnSelectedList}
            onClick={() => {
              if (isOnSelectedList) {
                dispatch(removeTrackFromActiveList({ trackId: id }));
              } else {
                dispatch(addTrackToActiveList({ trackId: id }));
              }
            }}
          />
        ) : (
          <> </>
        )
      }
    />
  );
}
