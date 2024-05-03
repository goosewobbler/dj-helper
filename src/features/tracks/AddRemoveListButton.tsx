import React, { ReactElement } from 'react';

import { AddToListIcon } from '../../icons/AddToListIcon.js';
import { RemoveFromListIcon } from '../../icons/RemoveFromListIcon.js';

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
