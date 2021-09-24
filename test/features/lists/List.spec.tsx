import * as React from 'react';
import { render, screen, RenderResult, userEvent } from '../../helpers/integration';
import { List } from '../../../src/features/lists/List';

let list: RenderResult;

describe('List', () => {
  let onClickDeleteMock: jest.Mock;
  let onClickEditMock: jest.Mock;

  beforeEach(() => {
    onClickDeleteMock = jest.fn();
    onClickEditMock = jest.fn();
    list = render(
      <List
        id={546}
      />,
    );
  });

  it('should render a List with the expected title', () => {
    expect(screen.getByTestId('title')).toHaveTextContent('test list');
  });

  it('should render the expected html', () => {
    expect(list.container).toMatchSnapshot();
  });

  describe('when the delete button is clicked', () => {
    beforeEach(() => {
      const deleteBtn = screen.getByRole('button', { name: /Delete/i });
      userEvent.click(deleteBtn);
    });

    it('should fire the delete click handler with the List ID', () => {
      expect(onClickDeleteMock).toHaveBeenCalledWith(546);
    });

    it('should render the expected html', () => {
      expect(list.container).toMatchSnapshot();
    });
  });

  describe('when the edit button is clicked', () => {
    beforeEach(() => {
      const editBtn = screen.getByRole('button', { name: /Edit/i });
      userEvent.click(editBtn);
    });

    it('should fire the edit click handler with the List ID', () => {
      expect(onClickEditMock).toHaveBeenCalledWith(546);
    });

    it('should render the expected html', () => {
      expect(list.container).toMatchSnapshot();
    });
  });
});
