import * as React from 'react';
import { render, screen, RenderResult, userEvent } from '../../helpers/integration';
import { List } from '../../../src/features/lists/List';

let list: RenderResult;

describe('List', () => {
  beforeEach(() => {
    list = render(<List id={546} />, {
      preloadedState: {
        lists: [{ id: 546, title: 'list one', tracks: [] }],
        embed: { isPlaying: false },
        tracks: [
          {
            id: 1,
            artist: 'goosewobbler',
            title: 'yo',
            duration: 300,
            sources: [{ sourceId: 1, url: 'https://github.com/goosewobbler' }],
          },
        ],
        browsers: [],
      },
    });
  });

  it('should render a List with the expected title', () => {
    expect(screen.getByTestId('title')).toHaveTextContent('list one');
  });

  it('should render the expected html', () => {
    expect(list.container).toMatchSnapshot();
  });

  describe('when the delete button is clicked', () => {
    beforeEach(() => {
      const deleteBtn = screen.getByRole('button', { name: /Delete/i });
      userEvent.click(deleteBtn);
    });

    it('should not render the list', () => {
      expect(screen.queryByTestId('title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('list')).not.toBeInTheDocument();
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

    it('should display the input field for editing the list title', () => {
      expect(screen.queryByLabelText('List Title')).toBeInTheDocument();
    });

    it('should render the expected html', () => {
      expect(list.container).toMatchSnapshot();
    });

    describe('and a valid title is entered', () => {
      beforeEach(() => {
        userEvent.type(screen.getByLabelText('List Title'), '{backspace}{backspace}{backspace}two{enter}');
      });

      it('should update the list title', () => {
        expect(screen.queryByLabelText('List Title')).not.toBeInTheDocument();
        expect(screen.getByTestId('title')).toHaveTextContent('list two');
      });

      it('should render the expected html', () => {
        expect(list.container).toMatchSnapshot();
      });
    });

    describe('and an invalid (empty) title is entered', () => {
      beforeEach(() => {
        userEvent.type(
          screen.getByLabelText('List Title'),
          '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}',
        );
      });

      it('should not update the list title', () => {
        expect(screen.queryByLabelText('List Title')).toHaveTextContent('');
        expect(screen.getByTestId('title')).toHaveTextContent('List Title');
      });

      it('should render the expected html', () => {
        expect(list.container).toMatchSnapshot();
      });
    });

    describe('and the edit is cancelled by pressing escape', () => {
      beforeEach(() => {
        userEvent.type(screen.getByLabelText('List Title'), 'this is not saved{escape}');
      });

      it('should revert the list title', () => {
        expect(screen.queryByLabelText('List Title')).not.toBeInTheDocument();
        expect(screen.getByTestId('title')).toHaveTextContent('list one');
      });

      it('should render the expected html', () => {
        expect(list.container).toMatchSnapshot();
      });
    });
  });
});
