import * as React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import Tabs from '../../../src/renderer/components/ComponentDetails/Tabs';

let tabs: RenderResult;

afterEach(() => {
  tabs.unmount();
});

describe('given a list of tab headings', () => {
  let headings: string[];

  beforeEach(() => {
    headings = ['look', 'some', 'headings'];
    tabs = render(
      <Tabs headings={headings}>
        <div className="child">I am child 1</div>
        <div className="child">I am child 2</div>
        <div className="child">I am child 3</div>
      </Tabs>,
    );
  });

  it('should render tab buttons with the expected text', () => {
    expect(tabs.getByTestId('header')).toContainElement(tabs.getByText('look'));
    expect(tabs.getByTestId('header')).toContainElement(tabs.getByText('some'));
    expect(tabs.getByTestId('header')).toContainElement(tabs.getByText('headings'));
  });

  it('should render the expected panel', () => {
    expect(tabs.getByTestId('panels')).toContainElement(tabs.getByText('I am child 1'));
  });

  it('should render the expected html', () => {
    expect(tabs.container).toMatchSnapshot();
  });

  describe('when a tab button is clicked', () => {
    beforeEach(() => {
      const button = tabs.getByText('headings');
      fireEvent.click(button);
    });

    it('should render the expected panel', () => {
      expect(tabs.getByTestId('panels')).toContainElement(tabs.getByText('I am child 3'));
    });

    it('should render the expected html', () => {
      expect(tabs.container).toMatchSnapshot();
    });
  });
});

describe('and heading children are provided', () => {
  beforeEach(() => {
    tabs = render(
      <Tabs headings={['so', 'many', 'headings']} headingChildren={<div>I am heading child</div>}>
        <div className="child">I am child 1</div>
        <div className="child">I am child 2</div>
        <div className="child">I am child 3</div>
      </Tabs>,
    );
  });

  it('should render the expected heading children', () => {
    expect(tabs.getByTestId('header')).toContainElement(tabs.getByText('I am heading child'));
  });

  it('should render the expected html', () => {
    expect(tabs.container).toMatchSnapshot();
  });
});
