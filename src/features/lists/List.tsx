import React, { ReactElement, BaseSyntheticEvent, KeyboardEvent, useState } from 'react';

type ListProps = {
  id: number;
  title: string;
  onClickDelete: (id: number) => void;
  onEditingComplete: (id: number, titleValue: string) => void;
};

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export function List({ id, title = '', onClickDelete, onEditingComplete }: ListProps): ReactElement {
  const [editing, setEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(title);

  const isValid = () => {
    return !!titleValue;
  };

  const handleTitleChange = (event: BaseSyntheticEvent): void => {
    setTitleValue((event.target as HTMLInputElement).value);
  };

  const handleKeyDown = (event: KeyboardEvent, listId: number): void => {
    if (event.code === KEY_ENTER && isValid()) {
      onEditingComplete(listId, titleValue);
      setEditing(false);
    } else if (event.key === KEY_ESCAPE) {
      setEditing(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <div className="list">
      <span className="title">
        {editing ? (
          <input
            className="flex-grow h-8 border border-solid text-form-field-text border-primary-text-30"
            type="text"
            onChange={(event): void => handleTitleChange(event)}
            onKeyDown={(event): void => handleKeyDown(event, id)}
            placeholder="List Title"
            value={titleValue}
          />
        ) : (
          title
        )}
      </span>
      {!editing && (
        <span className="action-btns">
          <button type="button" onClick={() => handleEdit()}>
            Edit
          </button>
          <button type="button" onClick={() => onClickDelete(id)}>
            Delete
          </button>
        </span>
      )}
    </div>
  );
}
