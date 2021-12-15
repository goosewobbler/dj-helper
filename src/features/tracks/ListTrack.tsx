import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { selectTrackById } from './tracksSlice';
import { LoadContext, Track } from '../../common/types';
import { removeTrackFromSelectedList } from '../lists/listsSlice';
import { CrossIcon } from '../../common/icons/CrossIcon';
import { BaseTrack } from './BaseTrack';
import { useAppDispatch, useAppSelector } from '../../common/hooks';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function ListTrack({
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
  const dispatch = useAppDispatch();
  const track = useAppSelector(selectTrackById(id));
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

  const dragAdditionalStyles = `opacity-${isDragging ? 20 : 100}`;
  drag(drop(dragRef));

  return (
    <div ref={dragRef} key={id} className={`cursor-move ${dragAdditionalStyles}`} data-handler-id={handlerId}>
      <BaseTrack
        id={id}
        context={context}
        additionalButtons={
          <button
            type="button"
            onClick={() => {
              dispatch(removeTrackFromSelectedList({ trackId: id }));
            }}
          >
            <CrossIcon className="cross-icon" />
          </button>
        }
      />
    </div>
  );
}
