import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from './List';
import { createList, deleteList, selectLists, updateListTitle } from './listsSlice';

export function ListPane() {
  const lists = useSelector(selectLists);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="listPane">
        {lists.map(
          (list): ReactElement => (
            <List
              key={list.id}
              id={list.id}
              title={list.title}
              onClickDelete={(id: number) => dispatch(deleteList(id))}
              onEditingComplete={(id: number, title: string) => dispatch(updateListTitle({ id, title }))}
            />
          ),
        )}
        <div className="">
          <button className="" aria-label="New List" onClick={() => dispatch(createList())}>
            New List
          </button>
        </div>
      </div>
    </div>
  );
}
