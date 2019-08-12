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
    const { children, renderButtons } = this.props;
    const { selectedIndex } = this.state;
    const panels = Array.isArray(children) ? children : [children];

    return (
      <div>
        <div className="header">
          <ul>{this.renderHeadings()}</ul>
          {renderButtons()}
        </div>
        <div>{panels[selectedIndex]}</div>
      </div>
    );
  }

  private renderHeadings() {
    const { selectedIndex } = this.state;
    const { headings } = this.props;
    return headings.map(
      (heading, index): React.ReactElement => {
        const selected = selectedIndex === index;
        const onClick = () => {
          this.setState({
            selectedIndex: index,
          });
        };
        return (
          <button type="button" key={heading} onClick={onClick}>
            {heading}
          </button>
        );
      },
    );
  }
}

export default Tabs;
