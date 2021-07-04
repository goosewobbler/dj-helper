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
    expect(list.getByTestId('title').textContent).toEqual('test list');
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

  describe('when the edit button is clicked', () => {
    beforeEach(() => {
      const button = list.getByTestId('edit');
      fireEvent.click(button);
    });

    it('should render a text input with the expected value', () => {
      expect(list.getByPlaceholderText('List Title').getAttribute('value')).toEqual('test list');
    });

    it('should render the expected html', () => {
      expect(list.container).toMatchSnapshot();
    });

    describe('and the edit is cancelled', () => {
      beforeEach(() => {
        const input = list.getByPlaceholderText('List Title');
        fireEvent.change(input, { target: { value: 'test list 2' } });
        fireEvent.keyDown(input, { key: 'Escape', keyCode: 27 });
      });

      it('should render a list with the expected title', () => {
        expect(list.getByTestId('title').textContent).toEqual('test list');
      });

      it('should render the expected html', () => {
        expect(list.container).toMatchSnapshot();
      });
    });

    describe('and the edit is completed', () => {
      beforeEach(() => {
        const input = list.getByPlaceholderText('List Title');
        fireEvent.change(input, { target: { value: 'test list 2' } });
        fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
      });

      it('should render a list with the expected title', () => {
        expect(list.getByTestId('title').textContent).toEqual('test list 2');
      });

      it('should render the expected html', () => {
        expect(list.container).toMatchSnapshot();
      });
    });

    describe('and an invalid title is entered', () => {
      beforeEach(() => {
        const input = list.getByPlaceholderText('List Title');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
      });

      it('should render a text input with the expected value', () => {
        expect(list.getByPlaceholderText('List Title').getAttribute('value')).toEqual('');
      });

      it('should render the expected html', () => {
        expect(list.container).toMatchSnapshot();
      });
    });
  });
});
