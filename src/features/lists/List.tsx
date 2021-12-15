import React, { ReactElement, BaseSyntheticEvent, KeyboardEvent, useRef, useCallback } from 'react';
import { ListTrack } from '../tracks/ListTrack';
import { ChevronIcon } from '../../icons/ChevronIcon';
import {
  deleteList,
  editList,
  finishEditList,
  moveTrackToIndex,
  revertEditList,
  selectList,
  selectListById,
  updateListTitle,
} from './listsSlice';
import { LoadContextType, Track } from '../../common/types';
import { EditIcon } from '../../icons/EditIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { CrossIcon } from '../../icons/CrossIcon';
import { TickIcon } from '../../icons/TickIcon';

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export function List({ id }: { id: number }): ReactElement {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectListById(id));
  const content = useRef<HTMLDivElement>(null);
  const moveTrack = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragTrack = list.tracks[dragIndex];

      dispatch(moveTrackToIndex({ trackId: dragTrack, newIndex: hoverIndex }));
    },
    [list.tracks, dispatch],
  );

  if (!list) {
    return <> </>;
  }
  const { title, tracks, editing, active } = list;
  const isValid = () => title !== '';

  const handleClickEdit = () => dispatch(editList({ id }));
  const handleClickConfirmEdit = () => {
    if (isValid()) {
      dispatch(finishEditList());
    }
  };
  const handleClickCancelEdit = () => dispatch(revertEditList());
  const handleClickDelete = () => dispatch(deleteList({ id }));
  const handleTitleChange = (event: BaseSyntheticEvent): void => {
    dispatch(updateListTitle({ id, title: (event.target as HTMLInputElement).value }));
  };
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === KEY_ENTER && isValid()) {
      dispatch(finishEditList());
    } else if (event.key === KEY_ESCAPE) {
      dispatch(revertEditList());
    }
  };

  const listKey = `list-${id}`;
  const validityRing = `focus:ring-${isValid() ? 'green' : 'red'}-300`;
  const accordionContentMaxHeightWhenActive = `${content?.current?.scrollHeight as number}px`;
  const accordionContentMaxHeight = active ? accordionContentMaxHeightWhenActive : '0px';
  const chevronAdditionalClassNamesWhenActive = 'transform rotate-90';
  const chevronAdditionalClassNames = active ? chevronAdditionalClassNamesWhenActive : '';

  function toggleAccordion() {
    dispatch(selectList({ id }));
  }

  return (
    <li id={listKey} className="flex flex-col list group-list" data-testid="list">
      <div
        className={`accordion transition duration-500 ease-in-out select-none outline-none border-none items-center group-list-hover:bg-green-400 bg-green-200 text-gray-700 flex cursor-pointer p-4 ${
          active ? 'font-black' : 'font-semibold'
        }`}
        role="menuitem"
        onClick={toggleAccordion}
        onKeyPress={toggleAccordion}
        tabIndex={0}
      >
        <span className="h-10 pt-2 text-sm title w-96" data-testid="title">
          {editing ? (
            <label className="block h-full" htmlFor="list-title">
              Enter List Title:
              <input
                id="list-title"
                className={`mx-4 focus:ring-4 focus:ring-offset-2 ring-opacity-30 ${validityRing}`}
                type="text"
                onChange={(event): void => handleTitleChange(event)}
                onKeyDown={(event): void => handleKeyDown(event)}
                placeholder="List Title"
                value={title}
              />
              <div className="inline-block float-right h-full -mt-1">
                <button className="p-1 pt-2 hover:bg-green-600" type="button" onClick={() => handleClickConfirmEdit()}>
                  <TickIcon className="tick-icon" />
                </button>
                <button className="p-1 hover:bg-red-200" type="button" onClick={() => handleClickCancelEdit()}>
                  <CrossIcon className="cross-icon" />
                </button>
              </div>
            </label>
          ) : (
            title
          )}
        </span>
        {!editing && (
          <span className="mr-4 opacity-0 action-btns group-list-hover:opacity-100">
            <button className="p-1 mx-1 hover:bg-green-600" type="button" onClick={() => handleClickEdit()}>
              <EditIcon className="edit-icon" />
            </button>
            <button className="p-1 mx-1 hover:bg-red-200" type="button" onClick={() => handleClickDelete()}>
              <TrashIcon className="trash-icon" />
            </button>
          </span>
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
