import * as React from 'react';

interface TabsProps {
  children?: React.ReactNode;
  headingChildren?: React.ReactNode;
  headings: string[];
  buttons?: React.ReactNode;
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
        const borderBottomWidth = `border-b-${selected ? '4' : '2'}`;
        const borderBottomColor = `border-${selected ? 'selected-item' : 'primary-text'}`;
        const onClick = (): void => {
          this.setState({
            selectedIndex: index,
          });
        };
        return (
          <button
            className={`p-1 outline-none border-0 text-lg my-0 mx-2 text-primary-text border-solid ${borderBottomWidth} ${borderBottomColor}`}
            type="button"
            key={heading}
            onClick={onClick}
          >
            {heading}
          </button>
        );
      },
    );
  }

  public render(): React.ReactElement {
    const { children, headingChildren } = this.props;
    const { selectedIndex } = this.state;
    const panels = Array.isArray(children) ? children : [children];

    return (
      <>
        <div className="flex justify-between header">
          <ul className="flex px-0 pt-2 pb-4">{this.renderHeadings()}</ul>
          {headingChildren}
        </div>
        <div className="relative flex flex-col flex-grow w-full h-full">{panels[selectedIndex]}</div>
      </>
    );
  }
}

export default Tabs;
