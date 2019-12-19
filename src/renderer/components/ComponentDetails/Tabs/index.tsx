import * as React from 'react';

interface TabsProps {
  children?: React.ReactElement[];
  headings: string[];
  renderButtons(): React.ReactElement;
}

interface TabsState {
  selectedIndex: number;
}

class Tabs extends React.Component<TabsProps, TabsState> {
  public constructor(props: TabsProps) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  private renderHeadings(): React.ReactElement[] {
    const { selectedIndex } = this.state;
    const { headings } = this.props;
    return headings.map(
      (heading, index): React.ReactElement => {
        const selected = selectedIndex === index;
        const onClick = (): void => {
          this.setState({
            selectedIndex: index,
          });
        };
        return (
          <button className={selected ? 'selected' : ''} type="button" key={heading} onClick={onClick}>
            {heading}
          </button>
        );
      },
    );
  }

  public render(): React.ReactElement {
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
}

export default Tabs;
