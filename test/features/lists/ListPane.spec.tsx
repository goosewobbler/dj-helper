import * as React from 'react';
import { fireEvent, render, RenderResult } from '../../helpers/integration';
import { ListPane } from '../../../src/features/lists/ListPane';

describe('ListPane', () => {
  let listPane: RenderResult;

  describe('initial render', () => {
    beforeEach(() => {
      listPane = render(<ListPane />);
    });

    it('should render no lists', () => {
      expect(listPane.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('should render a new list button', () => {
      expect(listPane.queryByRole('button', { name: /New List/i })).toBeInTheDocument();
    });

    it('should render the expected html', () => {
      expect(listPane.container).toMatchSnapshot();
    });

    describe('when the new list button is clicked', () => {
      beforeEach(() => {
        const newListBtn = listPane.getByRole('button', { name: /New List/i });
        fireEvent.click(newListBtn);
      });

      it('should render a new list', () => {
        expect(listPane.queryAllByRole('listitem').length).toEqual(1);
        expect(listPane.queryAllByTestId('title').map((title) => title.textContent)).toEqual(['List Title']);
      });

      it('should render the expected html', () => {
        expect(listPane.container).toMatchSnapshot();
      });
    });
  });

  describe('given a number of lists', () => {
    beforeEach(() => {
      listPane = render(<ListPane />, {
        preloadedState: {
          lists: [
            { id: 1, title: 'test list one', tracks: [] },
            { id: 2, title: 'test list two', tracks: [] },
            { id: 3, title: 'test list three', tracks: [] },
          ],
        },
      });
    });

    it('should render the expected lists', () => {
      expect(listPane.queryAllByRole('listitem').length).toEqual(3);
      expect(listPane.queryAllByTestId('title').map((title) => title.textContent)).toEqual([
        'test list one',
        'test list two',
        'test list three',
      ]);
    });

    it('should render a new list button', () => {
      expect(listPane.queryByRole('button', { name: /New List/i })).toBeInTheDocument();
    });

    it('should render the expected html', () => {
      expect(listPane.container).toMatchSnapshot();
    });

    describe('when the new list button is clicked', () => {
      beforeEach(() => {
        const newListBtn = listPane.getByRole('button', { name: /New List/i });
        fireEvent.click(newListBtn);
      });

      it('should render a new list', () => {
        expect(listPane.queryAllByRole('listitem').length).toEqual(4);
        expect(listPane.queryAllByTestId('title').map((title) => title.textContent)).toEqual([
          'test list one',
          'test list two',
          'test list three',
          'List Title',
        ]);
      });

      it('should render the expected html', () => {
        expect(listPane.container).toMatchSnapshot();
      });
    });

    describe('when a list delete button is clicked', () => {
      beforeEach(() => {
        const listDeleteBtns = listPane.getAllByRole('button', { name: /Delete/i });
        fireEvent.click(listDeleteBtns[1]);
      });

      it('should render the expected lists', () => {
        expect(listPane.queryAllByRole('listitem').length).toEqual(2);
        expect(listPane.queryAllByTestId('title').map((title) => title.textContent)).toEqual([
          'test list one',
          'test list three',
        ]);
      });

      it('should render the expected html', () => {
        expect(listPane.container).toMatchSnapshot();
      });
    });

    describe('when a list edit button is clicked', () => {
      beforeEach(() => {
        const listEditBtns = listPane.getAllByRole('button', { name: /Edit/i });
        fireEvent.click(listEditBtns[1]);
      });

      it('should render a text input with the expected value', () => {
        expect(listPane.getByLabelText('List Title').getAttribute('value')).toEqual('test list two');
      });

      it('should render the expected html', () => {
        expect(listPane.container).toMatchSnapshot();
      });

      describe('and the edit is cancelled', () => {
        beforeEach(() => {
          const input = listPane.getByLabelText('List Title');
          fireEvent.change(input, { target: { value: 'new title for test list two' } });
          fireEvent.keyDown(input, { key: 'Escape', keyCode: 27 });
        });

        it('should render a List with the expected title', () => {
          expect(listPane.getAllByTestId('title')[1].textContent).toEqual('test list two');
        });

        it('should render the expected html', () => {
          expect(listPane.container).toMatchSnapshot();
        });
      });

      describe('and the edit is completed', () => {
        beforeEach(() => {
          const input = listPane.getByLabelText('List Title');
          fireEvent.change(input, { target: { value: 'new title for test list two' } });
          fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
        });

        it('should render a List with the expected title', () => {
          expect(listPane.getAllByTestId('title')[1].textContent).toEqual('new title for test list two');
        });

        it('should render the expected html', () => {
          expect(listPane.container).toMatchSnapshot();
        });
      });

      describe('and an invalid title stops the edit from being completed', () => {
        beforeEach(() => {
          const input = listPane.getByLabelText('List Title');
          fireEvent.change(input, { target: { value: '' } });
          fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
        });

        it('should render a text input with the expected value', () => {
          expect(listPane.getByLabelText('List Title').getAttribute('value')).toEqual('');
        });

        it('should render the expected html', () => {
          expect(listPane.container).toMatchSnapshot();
        });
      });
    });
  });
});

// describe('when the edit button is clicked', () => {

//     describe('and an invalid title is entered', () => {
//       beforeEach(() => {
//         const input = list.getByLabelText('List Title');
//         fireEvent.change(input, { target: { value: '' } });
//         fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
//       });

//       it('should render a text input with the expected value', () => {
//         expect(list.getByLabelText('List Title').getAttribute('value')).toEqual('');
//       });

//       it('should render the expected html', () => {
//         expect(list.container).toMatchSnapshot();
//       });
//     });
