import * as React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { List } from '../../../src/features/lists/List';

let list: RenderResult;

afterEach(() => {
  list.unmount();
});

describe('List', () => {
  let onClickDeleteMock: jest.Mock;
  let onEditingCompleteMock: jest.Mock;

  beforeEach(() => {
    onClickDeleteMock = jest.fn();
    onEditingCompleteMock = jest.fn();
    list = render(
      <List id={546} title="test list" onClickDelete={onClickDeleteMock} onEditingComplete={onEditingCompleteMock} />,
    );
  });

  it('should render a list with the expected title', () => {
    expect(list.getByTestId('title')).toContainElement(list.getByText('test list'));
  });

  it('should render the expected html', () => {
    expect(list.container).toMatchSnapshot();
  });

  describe('when the delete button is clicked', () => {
    beforeEach(() => {
      const button = list.getByTestId('delete');
      fireEvent.click(button);
    });

    it('should fire the delete click handler with the list ID', () => {
      expect(onClickDeleteMock).toHaveBeenCalledWith(546);
    });

    it('should render the expected html', () => {
      expect(list.container).toMatchSnapshot();
    });
  });
});
