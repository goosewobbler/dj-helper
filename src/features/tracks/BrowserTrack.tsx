import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadContext, Track } from '../../common/types';
import { addTrackToSelectedList, removeTrackFromSelectedList, trackIsOnSelectedList } from '../lists/listsSlice';
import { AddRemoveListButton } from './AddRemoveListButton';
import { BaseTrack } from './BaseTrack';

export function BrowserTrack({ id, context }: { id: Track['id']; context: LoadContext }) {
  const dispatch = useDispatch();
  const isOnSelectedList = useSelector(trackIsOnSelectedList({ trackId: id }));

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
