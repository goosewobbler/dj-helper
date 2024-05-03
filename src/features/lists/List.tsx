import React, { ReactElement, BaseSyntheticEvent, KeyboardEvent, useRef, useCallback } from 'react';

import { ListTrack } from '../tracks/ListTrack.js';
import { ChevronIcon } from '../../icons/ChevronIcon.js';
import { selectListById } from './index.js';
import { LoadContextType, Track } from '../../common/types.js';
import { EditIcon } from '../../icons/EditIcon.js';
import { TrashIcon } from '../../icons/TrashIcon.js';
import { CrossIcon } from '../../icons/CrossIcon.js';
import { TickIcon } from '../../icons/TickIcon.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';
import { useStore } from '../../renderer/hooks/useStore.js';

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export function List({ id }: { id: number }): ReactElement {
  const dispatch = useDispatch();
  const list = useStore(selectListById(id));
  const content = useRef<HTMLDivElement>(null);
  const moveTrack = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragTrack = list.tracks[dragIndex];

      dispatch('LIST:MOVE_TRACK', { trackId: dragTrack, newIndex: hoverIndex });
    },
    [list?.tracks, dispatch],
  );

  if (!list) {
    return <> </>;
  }

  const { title, tracks, editing, active } = list;
  const isValid = () => title !== '';

  const handleClickEdit = () => dispatch('LIST:EDIT', { id });
  const handleClickConfirmEdit = () => {
    if (isValid()) {
      dispatch('LIST:EDIT_COMPLETE');
    }
  };
  const handleClickCancelEdit = () => dispatch('LIST:EDIT_REVERT');
  const handleClickDelete = () => dispatch('LIST:DELETE_LIST', { id });
  const handleTitleChange = (event: BaseSyntheticEvent): void => {
    dispatch('LIST:UPDATE_TITLE', { id, title: (event.target as HTMLInputElement).value });
  };
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === KEY_ENTER && isValid()) {
      dispatch('LIST:EDIT_COMPLETE');
    } else if (event.key === KEY_ESCAPE) {
      dispatch('LIST:EDIT_REVERT');
    }
  };

  const listKey = `list-${id}`;
  const validityRing = `focus:ring-${isValid() ? 'green' : 'red'}-300`;
  const accordionContentMaxHeightWhenActive = `${content?.current?.scrollHeight as number}px`;
  const accordionContentMaxHeight = active ? accordionContentMaxHeightWhenActive : '0px';
  const chevronAdditionalClassNamesWhenActive = 'transform rotate-90';
  const chevronAdditionalClassNames = active ? chevronAdditionalClassNamesWhenActive : '';

  function toggleAccordion() {
    dispatch('LIST:TOGGLE_ACTIVE', { id });
  }

  return (
    <li id={listKey} className="flex flex-col list group-list" data-testid="list">
      <div
        className={`accordion transition text-base duration-500 ease-in-out outline-none border-none items-center group-list-hover:bg-green-400 bg-green-200 text-gray-700 flex cursor-pointer p-4 ${
          active ? 'font-black' : 'font-normal'
        }`}
        role="menuitem"
        onClick={toggleAccordion}
        onKeyPress={toggleAccordion}
        tabIndex={0}
      >
        <span className="w-full h-10 pt-2 title" data-testid="title">
          {editing ? (
            <label className="block h-full" htmlFor="list-title">
              Enter List Title:
              <input
                id="list-title"
                className={`mx-4 focus:ring-4 focus:ring-offset-2 ring-opacity-30 ${validityRing}`}
                type="text"
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                placeholder="List Title"
                value={title}
              />
              <div className="inline-block float-right h-full -mt-1">
                <button className="p-1 pt-2 hover:bg-green-600" type="button" onClick={handleClickConfirmEdit}>
                  <TickIcon className="tick-icon" />
                </button>
                <button className="p-1 hover:bg-red-200" type="button" onClick={handleClickCancelEdit}>
                  <CrossIcon className="cross-icon" />
                </button>
              </div>
            </label>
          ) : (
            <span className="inline-block overflow-hidden">
              <span className="inline-block overflow-hidden w-80 overflow-ellipsis whitespace-nowrap">{title}</span>
              <button
                className="relative inline-block p-1 mx-4 align-middle opacity-0 bottom-2 hover:bg-green-600 group-list-hover:opacity-100"
                type="button"
                onClick={handleClickEdit}
                aria-label="Edit List Title"
              >
                <EditIcon className="edit-icon" />
              </button>
            </span>
          )}
        </span>
        {!editing && (
          <button
            className="float-right p-1 mx-1 opacity-0 group-list-hover:opacity-100 hover:bg-red-200"
            type="button"
            onClick={handleClickDelete}
            aria-label="Delete List"
          >
            <TrashIcon className="trash-icon" />
          </button>
        )}
        <ChevronIcon
          className={`accordion-icon ml-auto transition-transform duration-500 ease-in-out ${chevronAdditionalClassNames}`}
        />
      </div>
      <div
        ref={content}
        style={{ maxHeight: accordionContentMaxHeight }}
        className="overflow-hidden duration-500 ease-in-out bg-white accordion-content transition-max-height"
      >
        <ol className="p-4 mb-12 text-sm font-normal tracks">
          {tracks.map(
            (trackId: Track['id'], index: number): ReactElement => (
              <ListTrack
                key={trackId}
                id={trackId}
                context={{ contextId: id, contextType: LoadContextType.List }}
                listIndex={index}
                moveTrack={moveTrack}
              />
            ),
          )}
        </ol>
      </div>
    </li>
  );
}
