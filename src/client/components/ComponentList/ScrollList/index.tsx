import { throttle } from 'lodash/fp';
import * as React from 'react';
import * as ReactList from 'react-list';

import TopIcon from './TopIcon';

const ReactListComponent: any = ReactList;

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

  constructor(props: ScrollListProps) {
    super(props);

    this.state = {
      showScrollToTop: false,
    };

    this.handleListRef = this.handleListRef.bind(this);
    this.handleScrollToTheTop = this.handleScrollToTheTop.bind(this);
    this.handleScroll = throttle(200, this.handleScroll.bind(this)) as any;
  }

  public componentDidUpdate(prevProps: ScrollListProps) {
    if (
      this.listElement &&
      typeof this.props.selectedIndex === 'number' &&
      prevProps.selectedID !== this.props.selectedID
    ) {
      const [firstIndex, lastIndex] = this.listElement.getVisibleRange();
      if (this.props.selectedIndex < firstIndex || this.props.selectedIndex > lastIndex) {
        this.listElement.scrollTo(this.props.selectedIndex);
        this.handleScroll();
      }
    }
  }

  public render() {
    return (
      <div>
        <ul onScroll={this.handleScroll}>
          <ReactListComponent
            ref={this.handleListRef}
            itemRenderer={this.props.renderListItem}
            length={this.props.length}
            type="uniform"
            useStaticSize
            useTranslate3d
            minSize={20}
          />
        </ul>
        <button onClick={this.handleScrollToTheTop}>
          <TopIcon />
        </button>
      </div>
    );
  }

  private handleListRef(el: any) {
    this.listElement = el;
  }

  private handleScrollToTheTop() {
    if (this.listElement) {
      this.listElement.scrollTo(0);
      this.setState({ showScrollToTop: false });
    }
  }

  private handleScroll() {
    if (this.listElement) {
      const [firstIndex] = this.listElement.getVisibleRange();
      this.setState({ showScrollToTop: firstIndex > 10 });
    }
  }
}

const ScrollListAdapter = (props: ScrollListProps) => <ScrollList {...props} />;

export default ScrollListAdapter;
