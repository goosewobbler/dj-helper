import React, { ReactElement } from 'react';

import { List } from './List.js';
import { selectLists } from './index.js';
import { useStore } from '../../renderer/hooks/useStore.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';

export function ListPane(): ReactElement {
  const lists = useStore(selectLists);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col flex-grow">
      <ol className="flex flex-col listPane">
        {lists.map(
          (list): ReactElement => (
            <List key={list.id} id={list.id} />
          ),
        )}
      </ol>
      <div className="mt-2">
        <button
          className="p-1 bg-blue-100 border hover:bg-blue-200"
          type="button"
          aria-label="New List"
          onClick={() => {
            dispatch('LIST:EDIT_REVERT');
            dispatch('LIST:CREATE');
          }}
        >
          New List
        </button>
      </div>
    </div>
  );
}
