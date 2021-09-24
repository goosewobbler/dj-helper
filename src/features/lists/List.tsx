import React, { ReactElement, BaseSyntheticEvent, KeyboardEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrackMeta } from '../tracks/TrackMeta';
import { Chevron } from './Chevron';
import {
  deleteList,
  editList,
  finishEditList,
  revertEditList,
  selectList,
  selectListById,
  updateListTitle,
} from './listsSlice';
import { Track } from '../../common/types';

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export function List({ id }: { id: number }): ReactElement {
  const dispatch = useDispatch();
  const { title, tracks, editing, active } = useSelector(selectListById(id));
  const isValid = () => !!title;

  const handleClickEdit = () => dispatch(editList({ id }));
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
  const validityRing = `ring-${isValid() ? 'green' : 'red'}-300`;

  const content = useRef<HTMLDivElement>(null);

  function toggleAccordion() {
    dispatch(selectList({ id }));
  }

  // accordion
  // transition: background-color 0.6s ease;

  return (
    <li id={listKey} className="flex flex-col list">
      <div
        className={`accordion transition duration-500 ease-linear outline-none border-none items-center hover:bg-red-400 bg-gray-400 text-gray-700 flex cursor-pointer p-4 ${
          active ? 'bg-red-400' : ''
        }`}
        onClick={toggleAccordion}
      >
        <span className="font-sans text-sm font-semibold title" data-testid="title">
          {editing ? (
            <>
              <label htmlFor="list-title">
                List Title
                <input
                  id="list-title"
                  className={`ring-4 ring-opacity-30 ${validityRing}`}
                  type="text"
                  onChange={(event): void => handleTitleChange(event)}
                  onKeyDown={(event): void => handleKeyDown(event)}
                  placeholder="List Title"
                  value={title}
                />
              </label>
            </>
          ) : (
            title
          )}
        </span>
        {!editing && (
          <span className="action-btns">
            <button className="p-1 border" type="button" onClick={() => handleClickEdit()}>
              Edit
            </button>
            <button className="p-1 border" type="button" onClick={() => handleClickDelete()}>
              Delete
            </button>
          </span>
        )}
        <Chevron
          className={`accordion-icon ml-auto transition-transform duration-500 ease-linear ${
            active ? 'transform rotate-90' : ''
          }`}
        />
      </div>
      <div
        ref={content}
        style={{ maxHeight: `${active ? `${content?.current?.scrollHeight as number}px` : '0px'}` }}
        className="overflow-hidden duration-500 ease-linear bg-white accordion-content transition-max-height"
      >
        <ol className="p-4 font-sans text-sm font-normal tracks">
          {tracks.map(
            (trackId: Track['id']): ReactElement => (
              <TrackMeta key={trackId} id={trackId} context={listKey} />
            ),
          )}
        </ol>
      </div>
    </li>
  );
}
