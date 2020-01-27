import { throttle } from 'lodash/fp';
import * as React from 'react';
import ReactList from 'react-list';

import TopIcon from './TopIcon';

interface ScrollListProps {
  length: number;
  selectedIndex?: number;
  selectedID?: string;
  renderListItem(index: number, key: number | string): React.ReactElement;
}

interface ScrollListState {
  showScrollToTop: boolean;
}

class ScrollList extends React.Component<ScrollListProps, ScrollListState> {
  private listElement: ReactList | null;

  public constructor(props: ScrollListProps) {
    super(props);

    this.state = {
      showScrollToTop: false,
    };

    this.listElement = null;
    this.handleListRef = this.handleListRef.bind(this);
    this.handleScrollToTheTop = this.handleScrollToTheTop.bind(this);
    this.handleScroll = throttle(200, this.handleScroll.bind(this)) as () => void;
  }

  public componentDidUpdate(prevProps: ScrollListProps): void {
    const { selectedIndex, selectedID } = this.props;
    if (this.listElement && typeof selectedIndex === 'number' && prevProps.selectedID !== selectedID) {
      const [firstIndex, lastIndex] = this.listElement.getVisibleRange();
      if (selectedIndex < firstIndex || selectedIndex > lastIndex) {
        this.listElement.scrollTo(selectedIndex);
        this.handleScroll();
      }
    }
  }

  private handleListRef(el: ReactList): void {
    this.listElement = el;
  }

  private handleScrollToTheTop(): void {
    if (this.listElement) {
      this.listElement.scrollTo(0);
      this.setState({ showScrollToTop: false });
    }
  }

  private handleScroll(): void {
    if (this.listElement) {
      const [firstIndex] = this.listElement.getVisibleRange();
      this.setState({ showScrollToTop: firstIndex > 10 });
    }
  }

  // const ToTheTopButton = glamorous.button(
  //   {
  //     backgroundPosition: '50%',
  //     backgroundRepeat: 'no-repeat',
  //     backgroundSize: '40%',
  //     border: 'none',
  //     borderRadius: '1.5625rem',
  //     boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.2)',
  //     left: '50%',
  //     marginLeft: '-1.5625rem',
  //     transition: 'bottom 0.5s', TODO - transition
  //   },
  //   (props: { theme: ITheme; show: boolean }) => ({
  //     backgroundColor: props.theme.tertiaryBackgroundColour,
  //     bottom: props.show ? '1.25rem' : '-5.625rem',
  //   }),
  // );

  public render(): React.ReactElement {
    const { renderListItem, length } = this.props;
    const { showScrollToTop } = this.state;
    return (
      <div className="relative flex flex-col flex-grow">
        <ul className="flex-grow p-2 pb-1 overflow-y-scroll" onScroll={this.handleScroll}>
          <ReactList
            ref={this.handleListRef}
            itemRenderer={renderListItem}
            length={length}
            type="uniform"
            useStaticSize
            useTranslate3d
            minSize={20}
          />
        </ul>
        <button
          className={`absolute w-12 h-12 p-3 shadow outline-none bg-tertiary-background bottom-0 ${
            showScrollToTop ? '' : 'hidden'
          }`}
          type="button"
          onClick={this.handleScrollToTheTop}
        >
          <TopIcon />
        </button>
      </div>
    );
  }
}

export default ScrollList;
