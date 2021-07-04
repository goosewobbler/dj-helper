import * as React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { List } from '../../../src/features/lists/List';

let list: RenderResult;

describe('List', () => {
  let onClickDeleteMock: jest.Mock;
  let onEditingCompleteMock: jest.Mock;
  let onTitleChangeMock: jest.Mock;
  let onClickEditMock: jest.Mock;
  let onEditingCancelledMock: jest.Mock;

  beforeEach(() => {
    onClickDeleteMock = jest.fn();
    onEditingCompleteMock = jest.fn();
    onTitleChangeMock = jest.fn();
    onClickEditMock = jest.fn();
    onEditingCancelledMock = jest.fn();
    list = render(
      <List
        id={546}
        title="test list"
        onClickDelete={onClickDeleteMock}
        onEditingComplete={onEditingCompleteMock}
        onTitleChange={onTitleChangeMock}
        onClickEdit={onClickEditMock}
        onEditingCancelled={onEditingCancelledMock}
      />,
    );
  });

  it('should render a List with the expected title', () => {
    expect(list.getByTestId('title').textContent).toEqual('test list');
  });

  it('should render the expected html', () => {
    expect(list.container).toMatchSnapshot();
  });

  describe('when the delete button is clicked', () => {
    beforeEach(() => {
      const deleteBtn = list.getByRole('button', { name: /Delete/i });
      fireEvent.click(deleteBtn);
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
      const editBtn = list.getByRole('button', { name: /Edit/i });
      fireEvent.click(editBtn);
    });

    it('should fire the edit click handler with the List ID', () => {
      expect(onClickEditMock).toHaveBeenCalledWith(546);
    });

    it('should render the expected html', () => {
      expect(list.container).toMatchSnapshot();
    });
  });
});
