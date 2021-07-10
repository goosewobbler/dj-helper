import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from './List';
import {
  createList,
  editList,
  revertEditList,
  finishEditList,
  deleteList,
  selectLists,
  updateListTitle,
} from './listsSlice';

export function ListPane(): ReactElement {
  const lists = useSelector(selectLists);
  const dispatch = useDispatch();

  return (
    <div>
      <ol className="listPane" role="list">
        {lists.map(
          (list): ReactElement => (
            <List
              key={list.id}
              id={list.id}
              title={list.title}
              editing={list.editing}
              onTitleChange={(id: number, title: string) => dispatch(updateListTitle({ id, title }))}
              onClickEdit={(id: number) => dispatch(editList(id))}
              onClickDelete={(id: number) => dispatch(deleteList(id))}
              onEditingComplete={() => dispatch(finishEditList())}
              onEditingCancelled={(id: number) => dispatch(revertEditList(id))}
            />
          ),
        )}
      </ol>
      <div className="">
        <button
          className="p-1 bg-blue-100 border"
          type="button"
          aria-label="New List"
          onClick={() => dispatch(createList())}
        >
          New List
        </button>
      </div>
    </div>
  );
}
