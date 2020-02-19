import * as React from 'react';

interface TabsProps {
  children: React.ReactNodeArray;
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

  private renderHeadings(): React.ReactNode[] {
    const { selectedIndex } = this.state;
    const { headings } = this.props;
    return headings.map(
      (heading, index): React.ReactNode => {
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

  public render(): React.ReactNode {
    const { children, headingChildren } = this.props;
    const { selectedIndex } = this.state;

    return (
      <>
        <div className="flex justify-between header">
          <ul className="flex px-0 pt-2 pb-4">{this.renderHeadings()}</ul>
          {headingChildren}
        </div>
        <div className="relative flex flex-col flex-grow w-full h-full panels">{children[selectedIndex]}</div>
      </>
    );
  }
}

export default Tabs;
