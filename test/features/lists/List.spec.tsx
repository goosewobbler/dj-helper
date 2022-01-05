import * as React from 'react';
import { render, screen, RenderResult, userEvent } from '../../helpers/integration';
import { List } from '../../../src/features/lists/List';
import { mockState } from '../../helpers/mockState';

let list: RenderResult;
const preloadedState = mockState({
  lists: [{ id: 546, title: 'list one', tracks: [] }],
  tracks: [
    {
      id: 0,
      artist: 'goosewobbler',
      title: 'yo',
      duration: 300,
      sources: [{ sourceId: 0, url: 'https://github.com/goosewobbler' }],
    },
  ],
});

function hoverAndClick(buttonText: string) {
  const trigger = screen.getByText('list one');
  userEvent.hover(trigger);
  const btn = screen.getByRole('button', { name: buttonText });
  userEvent.click(btn);
}

describe('List', () => {
  it('should render a List with the expected title', () => {
    list = render(<List id={546} />, { preloadedState });
    expect(screen.getByTestId('title')).toHaveTextContent('list one');
  });

  it('should render the expected html', () => {
    list = render(<List id={546} />, { preloadedState });
    expect(list.container).toMatchSnapshot();
  });

  it('should display the edit and delete buttons on hover', () => {
    list = render(<List id={546} />, { preloadedState });
    const trigger = screen.getByText('list one');
    userEvent.hover(trigger);
    const deleteBtn = screen.getByRole('button', { name: /Delete List/i });
    expect(deleteBtn).toBeInTheDocument();
    const editBtn = screen.getByRole('button', { name: /Edit List Title/i });
    expect(editBtn).toBeInTheDocument();
  });

  describe('when the delete button is clicked', () => {
    it('should not render the list', () => {
      list = render(<List id={546} />, { preloadedState });
      hoverAndClick('Delete List');
      expect(screen.queryByTestId('title')).not.toBeInTheDocument();
      expect(screen.queryByTestId('list')).not.toBeInTheDocument();
    });

    it('should render the expected html', () => {
      list = render(<List id={546} />, { preloadedState });
      hoverAndClick('Delete List');
      expect(list.container).toMatchSnapshot();
    });
  });

  describe('when the edit button is clicked', () => {
    it('should display the input field for editing the list title', () => {
      list = render(<List id={546} />, { preloadedState });
      hoverAndClick('Edit List Title');
      expect(screen.getByLabelText('Enter List Title:')).toBeInTheDocument();
    });

    it('should render the expected html', () => {
      list = render(<List id={546} />, { preloadedState });
      hoverAndClick('Edit List Title');
      expect(list.container).toMatchSnapshot();
    });

    describe('and a valid title is entered', () => {
      it('should update the list title', () => {
        list = render(<List id={546} />, { preloadedState });
        hoverAndClick('Edit List Title');
        userEvent.type(screen.getByLabelText('Enter List Title:'), '{backspace}{backspace}{backspace}two{enter}');
        expect(screen.queryByLabelText('Enter List Title:')).not.toBeInTheDocument();
        expect(screen.getByTestId('title')).toHaveTextContent('list two');
      });

      it('should render the expected html', () => {
        list = render(<List id={546} />, { preloadedState });
        hoverAndClick('Edit List Title');
        userEvent.type(screen.getByLabelText('Enter List Title:'), '{backspace}{backspace}{backspace}two{enter}');
        expect(list.container).toMatchSnapshot();
      });
    });

    describe('and an invalid (empty) title is entered', () => {
      it('should not update the list title', () => {
        list = render(<List id={546} />, { preloadedState });
        hoverAndClick('Edit List Title');
        userEvent.type(
          screen.getByLabelText('Enter List Title:'),
          '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}',
        );
        expect(screen.queryByLabelText('Enter List Title:')).toHaveTextContent('');
        expect(screen.getByTestId('title')).toHaveTextContent('Enter List Title:');
      });

      it('should render the expected html', () => {
        list = render(<List id={546} />, { preloadedState });
        hoverAndClick('Edit List Title');
        userEvent.type(
          screen.getByLabelText('Enter List Title:'),
          '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}',
        );
        expect(list.container).toMatchSnapshot();
      });
    });

    describe('and the edit is cancelled by pressing escape', () => {
      it('should revert the list title', () => {
        list = render(<List id={546} />, { preloadedState });
        hoverAndClick('Edit List Title');
        userEvent.type(screen.getByLabelText('Enter List Title:'), 'this is not saved{escape}');
        expect(screen.queryByLabelText('Enter List Title:')).not.toBeInTheDocument();
        expect(screen.getByTestId('title')).toHaveTextContent('list one');
      });

      it('should render the expected html', () => {
        list = render(<List id={546} />, { preloadedState });
        hoverAndClick('Edit List Title');
        userEvent.type(screen.getByLabelText('Enter List Title:'), 'this is not saved{escape}');
        expect(list.container).toMatchSnapshot();
      });
    });
  });
});
