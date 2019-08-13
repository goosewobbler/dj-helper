import { throttle } from 'lodash/fp';
import * as React from 'react';
import ReactList from 'react-list';

import TopIcon from './TopIcon';

interface ScrollListProps {
  length: number;
  selectedIndex?: number;
  selectedID?: string;
  renderListItem(index: number, key: string): React.ReactElement<any>;
}

interface ScrollListState {
  showScrollToTop: boolean;
}

class ScrollList extends React.Component<ScrollListProps, ScrollListState> {
  private listElement: any;

  public constructor(props: ScrollListProps) {
    super(props);

    this.state = {
      showScrollToTop: false,
    };

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

  private handleListRef(el: React.ReactElement): void {
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

  public render(): React.ReactElement {
    const { renderListItem, length } = this.props;
    return (
      <div>
        <ul onScroll={this.handleScroll}>
          <ReactList
            //             ref={this.handleListRef}
            itemRenderer={renderListItem}
            length={length}
            type="uniform"
            useStaticSize
            useTranslate3d
            minSize={20}
          />
        </ul>
        <button type="button" onClick={this.handleScrollToTheTop}>
          <TopIcon />
        </button>
      </div>
    );
  }
}

const ScrollListAdapter = (props: ScrollListProps): React.ReactElement => <ScrollList {...props} />;

export default ScrollListAdapter;
