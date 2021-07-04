import React, { ReactElement, BaseSyntheticEvent, KeyboardEvent } from 'react';

type ListProps = {
  id: number;
  title: string;
  editing?: boolean;
  onTitleChange: (id: number, titleValue: string) => void;
  onClickEdit: (id: number) => void;
  onClickDelete: (id: number) => void;
  onEditingComplete: (id: number, titleValue: string) => void;
  onEditingCancelled: (id: number) => void;
};

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export function List({
  id,
  title,
  editing,
  onTitleChange,
  onEditingCancelled,
  onClickEdit,
  onClickDelete,
  onEditingComplete,
}: ListProps): ReactElement {
  const isValid = () => {
    return !!title;
  };

  const handleTitleChange = (event: BaseSyntheticEvent): void => {
    onTitleChange(id, (event.target as HTMLInputElement).value);
  };

  const handleKeyDown = (event: KeyboardEvent, listId: number): void => {
    if (event.key === KEY_ENTER && isValid()) {
      onEditingComplete(listId, (event.target as HTMLInputElement).value);
    } else if (event.key === KEY_ESCAPE) {
      onEditingCancelled(listId);
    }
  };

  const validityRing = `ring-${isValid() ? 'green' : 'red'}-300`;

  return (
    <li id={`list-${id}`} className="list" role="listitem">
      <span className="title" data-testid="title">
        {editing ? (
          <>
            <label htmlFor="list-title">List Title</label>
            <input
              id="list-title"
              className={`ring-4 ring-opacity-30 ${validityRing}`}
              type="text"
              onChange={(event): void => handleTitleChange(event)}
              onKeyDown={(event): void => handleKeyDown(event, id)}
              placeholder="List Title"
              value={title}
            />
          </>
        ) : (
          title
        )}
      </span>
      {!editing && (
        <span className="action-btns">
          <button type="button" onClick={() => onClickEdit(id)} role="button">
            Edit
          </button>
          <button type="button" onClick={() => onClickDelete(id)} role="button">
            Delete
          </button>
        </span>
      )}
    </li>
  );
}
