import * as React from 'react';

type TabsProps = {
  children: React.ReactNodeArray;
  headingChildren?: React.ReactNode;
  headings: string[];
  buttons?: React.ReactNode;
};

const renderHeadings = (
  headings: string[],
  selectedIndex: number,
  onClick: (index: number) => void,
): React.ReactNode[] =>
  headings.map(
    (heading, index): React.ReactNode => {
      const selected = selectedIndex === index;
      const borderBottomWidth = `border-b-${selected ? '4' : '2'}`;
      const borderBottomColor = `border-${selected ? 'selected-item' : 'primary-text'}`;
      return (
        <button
          className={`p-1 outline-none border-0 text-lg my-0 mx-2 text-primary-text border-solid ${borderBottomWidth} ${borderBottomColor}`}
          type="button"
          key={heading}
          onClick={(): void => onClick(index)}
        >
          {heading}
        </button>
      );
    },
  );

const Tabs = ({ children, headings, headingChildren }: TabsProps): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const onClick = (index: number): void => {
    setSelectedIndex(index);
  };

  return (
    <>
      <div className="flex justify-between header">
        <ul className="flex px-0 pt-2 pb-4">{renderHeadings(headings, selectedIndex, onClick)}</ul>
        {headingChildren}
      </div>
      <div className="relative flex flex-col flex-grow w-full h-full panels">{children[selectedIndex]}</div>
    </>
  );
};

export default Tabs;
