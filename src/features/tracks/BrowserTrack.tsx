import React from 'react';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { LoadContext, Track } from '../../common/types';
import { addTrackToSelectedList, removeTrackFromSelectedList, trackIsOnSelectedList } from '../lists/listsSlice';
import { AddRemoveListButton } from './AddRemoveListButton';
import { BaseTrack } from './BaseTrack';

export function BrowserTrack({ id, context }: { id: Track['id']; context: LoadContext }) {
  const dispatch = useAppDispatch();
  const isOnSelectedList = useAppSelector(trackIsOnSelectedList({ trackId: id }));

  return (
    <BaseTrack
      id={id}
      context={context}
      additionalButtons={
        <AddRemoveListButton
          isOnSelectedList={isOnSelectedList}
          onClick={() => {
            if (isOnSelectedList) {
              dispatch(removeTrackFromSelectedList({ trackId: id }));
            } else {
              dispatch(addTrackToSelectedList({ trackId: id }));
            }
          }}
        />
      }
    />
  );
}
