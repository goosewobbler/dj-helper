import React, { ReactElement, KeyboardEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createList, deleteList, selectLists, updateListTitle } from './listsSlice';

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export function ListPane() {
  const lists = useSelector(selectLists);
  const [editing, setEditing] = useState(false);
  const [valid, setValid] = useState(false);
  const dispatch = useDispatch();
  let title = '';

  const handleTitleChange = (event: React.BaseSyntheticEvent): void => {
    title = (event.target as HTMLInputElement).value;
    setValid(!!title);
  };

  const handleKeyDown = (event: KeyboardEvent, id: number): void => {
    if (event.code === KEY_ENTER && valid) {
      dispatch(updateListTitle({ id, title }));
      setEditing(false);
    } else if (event.key === KEY_ESCAPE) {
      setEditing(false);
    }
  };

  return (
    <div>
      <div className="listPane">
        {lists.map(
          (list): ReactElement => (
            <div key={list.id} className="list">
              <span className="title">
                {editing ? (
                  <input
                    className={'flex-grow h-8 border-solid border text-form-field-text border-primary-text-30'}
                    type="text"
                    onChange={(event): void => handleTitleChange(event)}
                    onKeyDown={(event): void => handleKeyDown(event, list.id)}
                    placeholder="List Title"
                  />
                ) : (
                  list.title
                )}
              </span>
              {!editing && (
                <span className="action-btns">
                  <button className="" onClick={() => setEditing(true)}>
                    Edit
                  </button>
                  <button className="" onClick={() => dispatch(deleteList(list.id))}>
                    Delete
                  </button>
                </span>
              )}
            </div>
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
