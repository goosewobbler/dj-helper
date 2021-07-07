import React, { useState, ReactElement, ReactNodeArray, ReactNode } from 'react';

type TabsProps = {
  children: ReactNodeArray;
  headings: string[];
  buttons?: ReactNode;
};

const renderHeadings = (
  headings: string[],
  selectedIndex: number,
  onClick: (index: number) => void,
): React.ReactNode[] =>
  headings.map((heading, index): ReactNode => {
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
  });

export const Tabs = ({ children, headings }: TabsProps): ReactElement => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onClick = (index: number): void => {
    setSelectedIndex(index);
  };

  return (
    <>
      <div className="flex justify-between" data-testid="header">
        <ul className="flex px-0 pt-2 pb-4">{renderHeadings(headings, selectedIndex, onClick)}</ul>
      </div>
      <div className="relative flex flex-col flex-grow w-full h-full" data-testid="panels">
        {children[selectedIndex]}
      </div>
    </>
  );
};
