import * as React from 'react';
import { render, screen, RenderResult, userEvent } from '../../helpers/integration';
import { ListPane } from '../../../src/features/lists/ListPane';

describe('ListPane', () => {
  let listPane: RenderResult;

  describe('initial render', () => {
    beforeEach(() => {
      listPane = render(<ListPane />);
    });

    it('should render no lists', () => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('should render a new list button', () => {
      expect(screen.queryByRole('button', { name: /New List/i })).toBeInTheDocument();
    });

    it('should render the expected html', () => {
      expect(listPane.container).toMatchSnapshot();
    });

    describe('when the new list button is clicked', () => {
      beforeEach(() => {
        const newListBtn = screen.getByRole('button', { name: /New List/i });
        userEvent.click(newListBtn);
      });

      it('should render a new list', () => {
        expect(screen.queryAllByRole('listitem').length).toEqual(1);
        expect(screen.queryAllByTestId('title').map((title) => title.textContent)).toEqual(['List Title']);
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
          tracks: [],
          browsers: [],
        },
      });
    });

    it('should render the expected lists', () => {
      expect(screen.queryAllByRole('listitem').length).toEqual(3);
      expect(screen.queryAllByTestId('title').map((title) => title.textContent)).toEqual([
        'test list one',
        'test list two',
        'test list three',
      ]);
    });

    it('should render a new list button', () => {
      expect(screen.queryByRole('button', { name: /New List/i })).toBeInTheDocument();
    });

    it('should render the expected html', () => {
      expect(listPane.container).toMatchSnapshot();
    });

    describe('when the new list button is clicked', () => {
      beforeEach(() => {
        const newListBtn = screen.getByRole('button', { name: /New List/i });
        userEvent.click(newListBtn);
      });

      it('should render a new list', () => {
        expect(screen.queryAllByRole('listitem').length).toEqual(4);
        expect(screen.queryAllByTestId('title').map((title) => title.textContent)).toEqual([
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
        const listDeleteBtns = screen.getAllByRole('button', { name: /Delete/i });
        userEvent.click(listDeleteBtns[1]);
      });

      it('should render the expected lists', () => {
        expect(screen.queryAllByRole('listitem').length).toEqual(2);
        expect(screen.queryAllByTestId('title').map((title) => title.textContent)).toEqual([
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
        const listEditBtns = screen.getAllByRole('button', { name: /Edit/i });
        userEvent.click(listEditBtns[1]);
      });

      it('should render a text input with the expected value', () => {
        expect(screen.getByLabelText('List Title')).toHaveValue('test list two');
      });

      it('should render the expected html', () => {
        expect(listPane.container).toMatchSnapshot();
      });

      describe('and the edit is cancelled', () => {
        beforeEach(() => {
          const input = screen.getByLabelText('List Title') as HTMLInputElement;
          input.setSelectionRange(0, 13);
          userEvent.type(input, 'new title for test list two{esc}');
        });

        it('should render a List with the expected title', () => {
          expect(screen.getAllByTestId('title')[1]).toHaveTextContent('test list two');
        });

        it('should render the expected html', () => {
          expect(listPane.container).toMatchSnapshot();
        });
      });

      describe('and the edit is completed', () => {
        beforeEach(() => {
          const input = screen.getByLabelText('List Title') as HTMLInputElement;
          input.setSelectionRange(0, 13);
          userEvent.type(input, '{backspace}new title for test list two{enter}');
        });

        it('should render a List with the expected title', () => {
          expect(screen.getAllByTestId('title')[1]).toHaveTextContent('new title for test list two');
        });

        it('should render the expected html', () => {
          expect(listPane.container).toMatchSnapshot();
        });
      });

      describe('and an invalid title stops the edit from being completed', () => {
        beforeEach(() => {
          const input = screen.getByLabelText('List Title') as HTMLInputElement;
          input.setSelectionRange(0, 13);
          userEvent.type(input, '{backspace}');
        });

        it('should render a text input with the expected value', () => {
          expect(screen.getByLabelText('List Title')).toHaveValue('');
        });

        it('should render the expected html', () => {
          expect(listPane.container).toMatchSnapshot();
        });
      });

      describe('and the new list button is clicked', () => {
        beforeEach(() => {
          const newListBtn = screen.getByRole('button', { name: /New List/i });
          userEvent.click(newListBtn);
        });

        it('should render a single text input with the expected value', () => {
          expect(screen.getByLabelText('List Title')).toHaveValue('New List');
        });

        it('should render the expected html', () => {
          expect(listPane.container).toMatchSnapshot();
        });
      });
    });
  });
});
