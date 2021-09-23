import React, { ReactElement, BaseSyntheticEvent, KeyboardEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrackMeta } from '../tracks/TrackMeta';
import { Chevron } from './Chevron';
import { deleteList, editList, finishEditList, revertEditList, selectList, selectListById, updateListTitle } from './listsSlice';
import { Track } from '../../common/types';

const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export function List({ id }: { id: number }): ReactElement {
  const dispatch = useDispatch();
  const { title, tracks, editing, active } = useSelector(selectListById(id));
  const isValid = () => !!title;

  const handleClickEdit = (id: number) => dispatch(editList({ id }));
  const handleClickDelete = (id: number) => dispatch(deleteList({ id }));
  const handleTitleChange = (event: BaseSyntheticEvent): void => {
    dispatch(updateListTitle({ id, title: (event.target as HTMLInputElement).value }));
  };
  const handleKeyDown = (event: KeyboardEvent, listId: number): void => {
    if (event.key === KEY_ENTER && isValid()) {
      dispatch(finishEditList());
    } else if (event.key === KEY_ESCAPE) {
      dispatch(revertEditList());
    }
  };

  const validityRing = `ring-${isValid() ? 'green' : 'red'}-300`;

  // const [setHeight, setHeightState] = useState('0px');
  // const [setRotate, setRotateState] = useState('accordion__icon');

  const content = useRef<HTMLDivElement>(null);

  function toggleAccordion() {
    dispatch(selectList({ id }));
    // setHeightState(
    //   active ? '0px' : `${content.current.scrollHeight}px`
    // );
    // setRotateState(
    //   active ? 'accordion__icon' : 'accordion__icon rotate'
    // );
  }

  return (
    <li id={`list-${id}`} className="list">
      <button className={`accordion ${active ? 'active' : ''}`} onClick={toggleAccordion}>
        <span className="title" data-testid="title">
        {editing ? (
          <>
            <label htmlFor="list-title">
              List Title
              <input
                id="list-title"
                className={`ring-4 ring-opacity-30 ${validityRing}`}
                type="text"
                onChange={(event): void => handleTitleChange(event)}
                onKeyDown={(event): void => handleKeyDown(event, id)}
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
          <button className="p-1 border" type="button" onClick={() => handleClickEdit(id)}>
            Edit
          </button>
          <button className="p-1 border" type="button" onClick={() => handleClickDelete(id)}>
            Delete
          </button>
        </span>
      )}
        <Chevron className={`${active ? 'accordion__icon' : 'accordion__icon rotate'}`} />
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${active ? '0px' : `${content?.current?.scrollHeight}px`}` }}
        className="accordion__content"
      >
        <ol className="tracks">
        {tracks.map(
          (trackId: Track['id']): ReactElement => (
            <TrackMeta
              key={trackId}
              id={trackId}
              context="listPane"
            />
          ),
        )}
      </ol>
      </div>
    </li>
  );
}
