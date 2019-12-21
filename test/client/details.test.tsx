import ComponentListItem from '../../src/client/components/ComponentListItem';
import render from './mocks/app';
import mockFetch from './mocks/fetch';

let details: any;

describe('node 0.12 module details', () => {
  beforeEach(() => {
    mockFetch();

    const { wrapper } = render();
    wrapper
      .find(ComponentListItem)
      .at(2)
      .simulate('click');
    details = wrapper.find('ComponentDetails');
  });

  test('the component name is displayed.', () => {
    const componentDetailsName = details.find('h2').text();

    expect(componentDetailsName).toBe('sport-search');
  });

  test('the component dependencies are displayed.', () => {
    const dependencies = details.find('.component-dependency .component-name-label').map((e: any) => e.text());

    expect(dependencies).toEqual(['bar', 'foo', 'football-scores-view']);
  });

  test('clicking on a component dependency will open its details.', () => {
    const dependency = details.find('.component-dependency').at(2);
    dependency.simulate('click');
    const componentDetailsName = details.find('h2').text();

    expect(componentDetailsName).toBe('football-scores-view');
  });

  test('the external links are displayed.', () => {
    const links = details.find('a').map((l: any) => l.prop('href'));

    expect(links).toEqual(
      expect.arrayContaining([
        'https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/sport-search',
        'https://github.com/bbc/morph-modules/tree/master/sport-search',
      ]),
    );
  });

  test('can link dependency.', () => {
    const linkButton = details.find('.component-link-button').at(0);
    const fetch = mockFetch();
    linkButton.simulate('click');

    expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-sport-search/link/bbc-morph-foo']);
  });

  test('can unlink dependency.', () => {
    const unlinkButton = details.find('.component-unlink-button');
    const fetch = mockFetch();
    unlinkButton.simulate('click');

    expect(fetch.getCalls()).toEqual([
      'http://localhost:3333/api/component/bbc-morph-sport-search/unlink/bbc-morph-bar',
    ]);
  });

  test('the correct pipeline links are displayed.', () => {
    const links = details.find('a').map((l: any) => l.prop('href'));

    expect(links).toEqual(
      expect.arrayContaining([
        'https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-promote-int/',
        'https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-promote-test/',
        'https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-promote-live/',
      ]),
    );
  });
});

describe('node 10 module details', () => {
  beforeEach(() => {
    mockFetch();

    const { wrapper } = render();
    wrapper
      .find(ComponentListItem)
      .at(3)
      .simulate('click');
    details = wrapper.find('ComponentDetails');
  });

  test('the correct pipeline links are displayed.', () => {
    const links = details.find('a').map((l: any) => l.prop('href'));

    expect(links).toEqual(
      expect.arrayContaining([
        'https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-modern-promote-int/',
        'https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-modern-promote-test/',
        'https://ci.user.morph.int.tools.bbc.co.uk/job/morph-asset-modern-promote-live/',
      ]),
    );
  });
});
