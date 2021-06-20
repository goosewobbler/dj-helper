import React, { ReactElement, CSSProperties } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ComponentListItem } from './ComponentListItem';
import { ComponentData } from '../../../common/types';

export type ListItemRendererProps = {
  index: number;
  style: CSSProperties;
};

type ComponentListProps = {
  components: ComponentData[];
  selectedComponent?: string;
  updateAndSelectComponent: (name: string) => void;
  favouriteComponent: (name: string, favourite: boolean) => void;
  startComponent: (name: string) => void;
  stopComponent: (name: string) => void;
};

const createListItemRenderer = (
  props: ComponentListProps,
): (({ index, style }: ListItemRendererProps) => ReactElement) => {
  const {
    components,
    selectedComponent,
    updateAndSelectComponent,
    favouriteComponent,
    startComponent,
    stopComponent,
  } = props;

  const ListItemRenderer = ({ index, style }: ListItemRendererProps): ReactElement => {
    const component = components[index];
    const marginInPx = 6;

    const listItemStyle = { ...style };

    if (typeof style.top === 'number') {
      listItemStyle.top = style.top + marginInPx;
    }

    if (typeof style.height === 'number') {
      listItemStyle.height = style.height - marginInPx;
    }

    return (
      <ComponentListItem
        style={listItemStyle}
        componentName={component.name}
        selected={component.name === selectedComponent}
        onClick={updateAndSelectComponent}
        onFavourite={favouriteComponent}
        onStart={startComponent}
        onStop={stopComponent}
      />
    );
  };

  return ListItemRenderer;
};

export const ComponentList = (props: ComponentListProps): ReactElement => {
  const { components, selectedComponent } = props;
  const selectedIndex = components.findIndex((component): boolean => component.name === selectedComponent);
  const listItemRenderer = createListItemRenderer(props);
  const listItemKey = (index: number): string => components[index].name;

  const listRef = React.createRef<FixedSizeList>();

  React.useCallback(() => {
    if (listRef?.current && typeof selectedIndex === 'number') {
      listRef.current.scrollToItem(selectedIndex);
    }
  }, [listRef, selectedIndex]);

  return (
    <div className="relative flex flex-col flex-grow">
      <AutoSizer disableWidth>
        {({ height }): React.ReactElement => (
          <FixedSizeList
            ref={listRef}
            className="flex-grow p-2 pb-1 overflow-y-scroll"
            height={height}
            itemCount={components.length}
            itemSize={40}
            itemKey={listItemKey}
            width="100%"
          >
            {listItemRenderer}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
