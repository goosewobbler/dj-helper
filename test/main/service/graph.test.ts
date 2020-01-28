import Grapher from '../../../src/server/service/Grapher';
import createMockService from '../mocks/service';

test('can get dependant graph data from service', async () => {
  const { service } = await createMockService();

  const dependantData = await service.getDependantGraph('bbc-morph-baz');

  expect(dependantData).toEqual({
    edges: [
      {
        from: 2,
        to: 0,
      },
    ],
    nodes: [
      {
        id: 2,
        name: 'bbc-morph-baz',
      },
      {
        id: 0,
        name: 'bbc-morph-foo',
      },
    ],
  });
});

test('can get dependency graph data from service', async () => {
  const { service } = await createMockService();

  const dependantData = await service.getDependencyGraph('bbc-morph-foo');

  expect(dependantData).toEqual({
    edges: [
      {
        from: 0,
        to: 1,
      },
      {
        from: 0,
        to: 2,
      },
    ],
    nodes: [
      {
        id: 0,
        name: 'bbc-morph-foo',
      },
      {
        id: 1,
        name: 'bbc-morph-bar',
      },
      {
        id: 2,
        name: 'bbc-morph-baz',
      },
    ],
  });
});

test('shared parent', () => {
  const grapher = Grapher({
    a: [{ name: 'b1' }, { name: 'b2' }],
    b1: [{ name: 'c' }],
    b2: [{ name: 'c' }],
    c: [],
  });

  expect(grapher.getDependencyData('a')).toEqual({
    edges: [{ from: 0, to: 1 }, { from: 1, to: 3 }, { from: 0, to: 2 }, { from: 2, to: 3 }],
    nodes: [{ id: 0, name: 'a' }, { id: 1, name: 'b1' }, { id: 3, name: 'c' }, { id: 2, name: 'b2' }],
  });

  expect(grapher.getDependantData('c')).toEqual({
    edges: [{ from: 3, to: 1 }, { from: 1, to: 0 }, { from: 3, to: 2 }, { from: 2, to: 0 }],
    nodes: [{ id: 3, name: 'c' }, { id: 1, name: 'b1' }, { id: 0, name: 'a' }, { id: 2, name: 'b2' }],
  });
});

test('missing dependency', () => {
  const grapher = Grapher({
    a: [{ name: 'b1' }, { name: 'b2' }],
    b1: [{ name: 'd' }],
    b2: [{ name: 'd' }],
    c: [],
  });

  expect(grapher.getDependencyData('a')).toEqual({
    edges: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    nodes: [{ id: 0, name: 'a' }, { id: 1, name: 'b1' }, { id: 2, name: 'b2' }],
  });

  expect(grapher.getDependantData('c')).toEqual({ edges: [], nodes: [{ id: 3, name: 'c' }] });
});
