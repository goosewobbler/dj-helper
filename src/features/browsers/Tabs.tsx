import React, { ReactElement, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { createBrowser, selectActiveBrowser, tabSelected } from './browsersSlice';

type TabsProps = {
  children: ReactNode[];
  headings: string[];
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
  const dispatch = useAppDispatch();
  const activeBrowser = useAppSelector(selectActiveBrowser());
  const selectedIndex = activeBrowser.id;
  const onClick = (index: number): void => {
    dispatch(tabSelected({ id: index }));
  };

  return (
    <>
      <div className="flex justify-between" data-testid="header">
        <ul className="flex px-0 pt-2 pb-4">
          {renderHeadings(headings, selectedIndex, onClick)}
          <li>
            <button
              className="p-1 mx-2 my-0 text-lg border-0 border-solid outline-none text-primary-text"
              type="button"
              onClick={() => dispatch(createBrowser({}))}
            >
              +
            </button>
          </li>
        </ul>
      </div>
      <div className="relative flex flex-col flex-grow w-full h-full" data-testid="panels">
        {children[selectedIndex]}
      </div>
    </>
  );
};
