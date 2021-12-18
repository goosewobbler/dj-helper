import React, { ReactElement } from 'react';
import { AddToListIcon } from '../../icons/AddToListIcon';
import { RemoveFromListIcon } from '../../icons/RemoveFromListIcon';

export function AddRemoveListButton({
  isOnSelectedList,
  onClick,
}: {
  isOnSelectedList: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <button type="button" onClick={() => onClick()}>
      {isOnSelectedList ? (
        <RemoveFromListIcon className="remove-from-list-btn" />
      ) : (
        <AddToListIcon className="add-to-list-btn" />
      )}
    </button>
  );
}
