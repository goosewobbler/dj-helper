import React from 'react';

import { LoadContext, Track } from '../../common/types.js';
import { selectActiveList, trackIsOnActiveList } from '../lists/index.js';
import { AddRemoveListButton } from './AddRemoveListButton.js';
import { BaseTrack } from './BaseTrack.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';
import { useStore } from '../../renderer/hooks/useStore.js';

export function BrowserTrack({ id, context }: { id: Track['id']; context: LoadContext }) {
  const dispatch = useDispatch();
  const hasActiveList = !!useStore(selectActiveList);
  const isOnSelectedList = useStore(trackIsOnActiveList({ trackId: id }));

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
                dispatch('LIST:REMOVE_TRACK', { trackId: id });
              } else {
                dispatch('LIST:ADD_TRACK', { trackId: id });
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
