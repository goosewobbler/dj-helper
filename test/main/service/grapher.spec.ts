import { readFileSync } from 'fs-extra';
import { Grapher, createGrapher } from '../../../src/main/service/grapher';

let grapher: Grapher;

const rawJson = readFileSync(`${__dirname}/../test-data/morph-module-dependencies.json`, 'utf-8');
const morphModuleDependencyList = JSON.parse(rawJson);

beforeEach(() => {
  grapher = createGrapher(morphModuleDependencyList);
});

it('should return dependant graph data for a module with no dependants', () => {
  const dependantData = grapher.getDependantData('bbc-morph-sport-index');
  expect(dependantData).toEqual({
    edges: [],
    nodes: [
      {
        id: 1005,
        name: 'bbc-morph-sport-index',
      },
    ],
  });
});

it('should return dependant graph data for a module with dependants', () => {
  const dependantData = grapher.getDependantData('bbc-morph-sport-social-media-embed');
  expect(dependantData).toEqual({
    edges: [
      {
        from: 1079,
        to: 240,
      },
      {
        from: 1079,
        to: 868,
      },
    ],
    nodes: [
      {
        id: 1079,
        name: 'bbc-morph-sport-social-media-embed',
      },
      {
        id: 240,
        name: 'bbc-morph-cps-story',
      },
      {
        id: 868,
        name: 'bbc-morph-sport-best-of-social-media-2',
      },
    ],
  });
});

it('should return dependency graph data for a module with no dependencies', () => {
  const dependencyData = grapher.getDependencyData('bbc-morph-app-bridge');
  expect(dependencyData).toEqual({
    edges: [],
    nodes: [
      {
        id: 4,
        name: 'bbc-morph-app-bridge',
      },
    ],
  });
});

it('should return dependency graph data for a module with dependencies', () => {
  const dependencyData = grapher.getDependencyData('bbc-morph-sport-football-scores-components');
  expect(dependencyData).toEqual({
    edges: [
      {
        to: 603,
        from: 954,
      },
      {
        from: 954,
        to: 418,
      },
      {
        from: 418,
        to: 795,
      },
      {
        from: 954,
        to: 1034,
      },
      {
        from: 954,
        to: 1146,
      },
    ],
    nodes: [
      {
        id: 954,
        name: 'bbc-morph-sport-football-scores-components',
      },
      {
        id: 603,
        name: 'bbc-morph-grandstand',
      },
      {
        id: 418,
        name: 'bbc-morph-istats',
      },
      {
        id: 795,
        name: 'bbc-morph-promise',
      },
      {
        id: 1034,
        name: 'bbc-morph-sport-native-app-helper',
      },
      {
        id: 1146,
        name: 'bbc-morph-sportsdata-soccer-event-progress-period-helper',
      },
    ],
  });
});

// test('can get dependency graph data from service', async () => {
//   const { service } = await createMockService();

//   const dependantData = await service.getDependencyGraph('bbc-morph-foo');

//   expect(dependantData).toEqual({
//     edges: [
//       {
//         from: 0,
//         to: 1,
//       },
//       {
//         from: 0,
//         to: 2,
//       },
//     ],
//     nodes: [
//       {
//         id: 0,
//         name: 'bbc-morph-foo',
//       },
//       {
//         id: 1,
//         name: 'bbc-morph-bar',
//       },
//       {
//         id: 2,
//         name: 'bbc-morph-baz',
//       },
//     ],
//   });
// });

// test('shared parent', () => {
//   const grapher = Grapher({
//     a: [{ name: 'b1' }, { name: 'b2' }],
//     b1: [{ name: 'c' }],
//     b2: [{ name: 'c' }],
//     c: [],
//   });

//   expect(grapher.getDependencyData('a')).toEqual({
//     edges: [
//       { from: 0, to: 1 },
//       { from: 1, to: 3 },
//       { from: 0, to: 2 },
//       { from: 2, to: 3 },
//     ],
//     nodes: [
//       { id: 0, name: 'a' },
//       { id: 1, name: 'b1' },
//       { id: 3, name: 'c' },
//       { id: 2, name: 'b2' },
//     ],
//   });

//   expect(grapher.getDependantData('c')).toEqual({
//     edges: [
//       { from: 3, to: 1 },
//       { from: 1, to: 0 },
//       { from: 3, to: 2 },
//       { from: 2, to: 0 },
//     ],
//     nodes: [
//       { id: 3, name: 'c' },
//       { id: 1, name: 'b1' },
//       { id: 0, name: 'a' },
//       { id: 2, name: 'b2' },
//     ],
//   });
// });

// test('missing dependency', () => {
//   const grapher = Grapher({
//     a: [{ name: 'b1' }, { name: 'b2' }],
//     b1: [{ name: 'd' }],
//     b2: [{ name: 'd' }],
//     c: [],
//   });

//   expect(grapher.getDependencyData('a')).toEqual({
//     edges: [
//       { from: 0, to: 1 },
//       { from: 0, to: 2 },
//     ],
//     nodes: [
//       { id: 0, name: 'a' },
//       { id: 1, name: 'b1' },
//       { id: 2, name: 'b2' },
//     ],
//   });

//   expect(grapher.getDependantData('c')).toEqual({ edges: [], nodes: [{ id: 3, name: 'c' }] });
// });
