import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { embedRequestInFlight, loadAndPlayTrack, pauseTrack, trackIsPlaying } from '../embed/embedSlice';
import { selectTrackById } from './tracksSlice';
import { LoadContext, LoadContextType, Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import { addTrackToSelectedList, removeTrackFromSelectedList, trackIsOnSelectedList } from '../lists/listsSlice';
import { PlayPauseButton } from './PlayPauseButton';
import { AddRemoveListButton } from './AddRemoveListButton';
import { CrossIcon } from './CrossIcon';

function displayTrackDuration(duration: number) {
  const date = new Date(duration * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function TrackMeta({
  id,
  context,
  listIndex,
  moveTrack,
}: {
  id: Track['id'];
  context: LoadContext;
  listIndex?: number;
  moveTrack?: (dragIndex: number, hoverIndex: number) => void;
}) {
  const dispatch = useDispatch();
  const track = useSelector(selectTrackById(id));
  const isPlaying = useSelector(trackIsPlaying({ trackId: id }));
  const isOnSelectedList = useSelector(trackIsOnSelectedList({ trackId: id }));
  const showSpinner = useSelector(embedRequestInFlight());
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'track',
    item: () => ({ id, index: listIndex }),
    collect: (monitor: { isDragging: () => boolean }) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ handlerId }, drop] = useDrop({
    accept: 'track',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!dragRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = listIndex as number;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = dragRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      if (moveTrack) {
        moveTrack(dragIndex, hoverIndex);
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  if (!track) {
    return <> </>;
  }
  const { artist, title, duration, sources } = track;
  const isListContext = context.contextType === LoadContextType.List;
  const isBrowserContext = context.contextType === LoadContextType.Browser;
  const isPlayingAdditionalStyles = isPlaying ? 'bg-blue-200' : '';
  log('zomg loading track', { artist, title, duration, sources });

  const dragAdditionalStyles = `opacity-${isDragging ? 20 : 100}`;
  drag(drop(dragRef));

  return (
    <div
      ref={dragRef}
      key={id}
      className={`group-scope h-10 cursor-move ${isPlayingAdditionalStyles} ${dragAdditionalStyles}`}
      data-handler-id={handlerId}
    >
      <span
        className={`inline-block overflow-hidden whitespace-nowrap overflow-ellipsis ${
          isListContext ? 'w-24' : 'w-32'
        }`}
      >
        {artist}
      </span>
      <span
        className={`inline-block overflow-hidden whitespace-nowrap overflow-ellipsis ${
          isListContext ? 'w-56' : 'w-80'
        }`}
      >
        {title}
      </span>
      <span className="inline-block w-10 overflow-hidden whitespace-nowrap">{displayTrackDuration(duration)}</span>
      <span className="inline-block w-16 opacity-0 group-scope-hover:opacity-100">
        <PlayPauseButton
          isPlaying={isPlaying}
          showSpinner={showSpinner}
          onClick={() => {
            log('invoke play', { trackId: id, context });
            dispatch(isPlaying ? pauseTrack() : loadAndPlayTrack({ trackId: id, context }));
          }}
        />
      </span>
      <span className="inline-block w-5 opacity-0 group-scope-hover:opacity-100">
        {isListContext && isOnSelectedList && (
          <button
            type="button"
            onClick={() => {
              dispatch(removeTrackFromSelectedList({ trackId: id }));
            }}
          >
            <CrossIcon className="cross-icon" />
          </button>
        )}
        {isBrowserContext && (
          <AddRemoveListButton
            isOnSelectedList={isOnSelectedList}
            onClick={() => {
              if (isOnSelectedList) {
                dispatch(removeTrackFromSelectedList({ trackId: id }));
              } else {
                dispatch(addTrackToSelectedList({ trackId: id }));
              }
            }}
          />
        )}
      </span>
    </div>
  );
}
