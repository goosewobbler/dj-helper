import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Tabs from '../../../src/renderer/components/ComponentDetails/Tabs';

let tabs: ReactWrapper;

describe('given a list of tab headings', () => {
  let headings: string[];

  beforeEach(() => {
    headings = ['look', 'some', 'headings'];
    tabs = mount(
      <Tabs headings={headings}>
        <div className="child">I am child 1</div>
        <div className="child">I am child 2</div>
        <div className="child">I am child 3</div>
      </Tabs>,
    );
  });

  afterEach(() => {
    tabs.unmount();
  });

  it('should render tab buttons with the expected text', () => {
    expect(
      tabs
        .find('button')
        .at(0)
        .text(),
    ).toEqual(headings[0]);
    expect(
      tabs
        .find('button')
        .at(1)
        .text(),
    ).toEqual(headings[1]);
    expect(
      tabs
        .find('button')
        .at(2)
        .text(),
    ).toEqual(headings[2]);
  });

  it('should render the expected panel', () => {
    expect(tabs.find('.panels').contains(<div className="child">I am child 1</div>)).toEqual(true);
  });

  it('should render the expected html', () => {
    expect(tabs.html()).toMatchSnapshot();
  });

  describe('and heading children are provided', () => {
    beforeEach(() => {
      tabs = mount(
        <Tabs
          headings={['so', 'many', 'headings']}
          headingChildren={<div className="heading-child">I am heading child 1</div>}
        >
          <div className="child">I am child 1</div>
          <div className="child">I am child 2</div>
          <div className="child">I am child 3</div>
        </Tabs>,
      );
    });

    it('should render the expected heading children', () => {
      expect(tabs.find('.header').contains(<div className="heading-child">I am heading child 1</div>)).toEqual(true);
    });

    it('should render the expected html', () => {
      expect(tabs.html()).toMatchSnapshot();
    });
  });

  describe('when a tab button is clicked', () => {
    beforeEach(() => {
      tabs
        .find('button')
        .at(2)
        .simulate('click');
    });

    it('should render the expected panel', () => {
      expect(tabs.find('.panels').contains(<div className="child">I am child 3</div>)).toEqual(true);
    });

    it('should render the expected html', () => {
      expect(tabs.html()).toMatchSnapshot();
    });
  });
});
