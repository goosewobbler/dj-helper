import * as React from 'react';

interface TabsProps {
  children?: any;
  headings: any[];
  renderButtons: any;
}

interface TabsState {
  selectedIndex: number;
}

class Tabs extends React.Component<TabsProps, TabsState> {
  constructor(props: TabsProps) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  public render() {
    const panels = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

    return (
      <div>
        <div className="header">
          <ul>{this.renderHeadings()}</ul>
          {this.props.renderButtons()}
        </div>
        <div>{panels[this.state.selectedIndex]}</div>
      </div>
    );
  }

  private renderHeadings() {
    return this.props.headings.map((heading, index) => {
      const selected = this.state.selectedIndex === index;
      const onClick = () => {
        this.setState({
          selectedIndex: index,
        });
      };
      return (
        <button key={heading} onClick={onClick}>
          {heading}
        </button>
      );
    });
  }
}

export default Tabs;
