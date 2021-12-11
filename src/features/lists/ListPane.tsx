import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from './List';
import { createList, revertEditList, selectLists } from './listsSlice';

export function ListPane(): ReactElement {
  const lists = useSelector(selectLists);
  const dispatch = useDispatch();

  return (
    <div>
      <ol className="listPane">
        {lists.map(
          (list): ReactElement => (
            <List key={list.id} id={list.id} />
          ),
        )}
      </ol>
      <div className="mt-2">
        <button
          className="p-1 bg-blue-100 border"
          type="button"
          aria-label="New List"
          onClick={() => {
            dispatch(revertEditList());
            dispatch(createList());
          }}
        >
          New List
        </button>
      </div>
    </div>
  );
}
