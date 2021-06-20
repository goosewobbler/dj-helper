import { createGrapher } from '../../../src/main/service/grapher';

describe('getDependantData', () => {
  it('should return the expected graph data for a module without dependants', () => {
    const grapher = createGrapher({
      'dependency-a': [],
      'dependency-b': [],
      'dependency-c': [],
      'module-without-dependants': [{ name: 'dependency-a' }, { name: 'dependency-b' }, { name: 'dependency-c' }],
    });
    const dependantData = grapher.getDependantData('module-without-dependants');
    expect(dependantData).toEqual({
      edges: [],
      nodes: [{ id: 3, name: 'module-without-dependants' }],
    });
  });

  it('should return the expected graph data for a module with dependants', () => {
    const grapher = createGrapher({
      'dependant-a': [{ name: 'module-with-dependants' }],
      'dependant-b': [{ name: 'module-with-dependants' }],
      'dependency-c': [],
      'module-with-dependants': [{ name: 'dependency-c' }],
    });
    const dependantData = grapher.getDependantData('module-with-dependants');
    expect(dependantData).toEqual({
      edges: [
        { from: 3, to: 0 },
        { from: 3, to: 1 },
      ],
      nodes: [
        { id: 3, name: 'module-with-dependants' },
        { id: 0, name: 'dependant-a' },
        { id: 1, name: 'dependant-b' },
      ],
    });
  });

  it('should correctly handle shared parents', () => {
    const grapher = createGrapher({
      'module-with-dependencies': [{ name: 'dependency-a' }, { name: 'dependency-b' }],
      'dependency-a': [{ name: 'shared-parent' }],
      'dependency-b': [{ name: 'shared-parent' }],
      'shared-parent': [],
    });
    const dependantData = grapher.getDependantData('shared-parent');
    expect(dependantData).toEqual({
      edges: [
        { from: 3, to: 1 },
        { from: 1, to: 0 },
        { from: 3, to: 2 },
        { from: 2, to: 0 },
      ],
      nodes: [
        { id: 3, name: 'shared-parent' },
        { id: 1, name: 'dependency-a' },
        { id: 0, name: 'module-with-dependencies' },
        { id: 2, name: 'dependency-b' },
      ],
    });
  });
});

describe('getDependencyData', () => {
  it('should return the expected graph data for a module without dependencies', () => {
    const grapher = createGrapher({
      'dependant-a': [{ name: 'module-with-dependants' }],
      'dependant-b': [{ name: 'module-with-dependants' }],
      'dependency-c': [],
      'module-without-dependencies': [],
    });
    const dependencyData = grapher.getDependencyData('module-without-dependencies');
    expect(dependencyData).toEqual({
      edges: [],
      nodes: [{ id: 3, name: 'module-without-dependencies' }],
    });
  });

  it('should return the expected graph data for a module with dependencies', () => {
    const grapher = createGrapher({
      'dependency-a': [],
      'dependency-b': [],
      'dependency-c': [],
      'module-with-dependencies': [{ name: 'dependency-a' }, { name: 'dependency-b' }, { name: 'dependency-c' }],
    });
    const dependencyData = grapher.getDependencyData('module-with-dependencies');
    expect(dependencyData).toEqual({
      edges: [
        { from: 3, to: 0 },
        { from: 3, to: 1 },
        { from: 3, to: 2 },
      ],
      nodes: [
        { id: 3, name: 'module-with-dependencies' },
        { id: 0, name: 'dependency-a' },
        { id: 1, name: 'dependency-b' },
        { id: 2, name: 'dependency-c' },
      ],
    });
  });

  it('should correctly handle shared parents', () => {
    const grapher = createGrapher({
      'module-with-dependencies': [{ name: 'dependency-a' }, { name: 'dependency-b' }],
      'dependency-a': [{ name: 'shared-parent' }],
      'dependency-b': [{ name: 'shared-parent' }],
      'shared-parent': [],
    });
    const dependencyData = grapher.getDependencyData('module-with-dependencies');
    expect(dependencyData).toEqual({
      edges: [
        { from: 0, to: 1 },
        { from: 1, to: 3 },
        { from: 0, to: 2 },
        { from: 2, to: 3 },
      ],
      nodes: [
        { id: 0, name: 'module-with-dependencies' },
        { id: 1, name: 'dependency-a' },
        { id: 3, name: 'shared-parent' },
        { id: 2, name: 'dependency-b' },
      ],
    });
  });

  it('should handle missing dependencies', () => {
    const grapher = createGrapher({
      'module-a': [{ name: 'dependency-a' }, { name: 'dependency-b' }],
      'dependency-a': [{ name: 'missing-dependency' }],
      'dependency-b': [{ name: 'missing-dependency' }],
      'module-b': [],
    });

    expect(grapher.getDependencyData('module-a')).toEqual({
      edges: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
      ],
      nodes: [
        { id: 0, name: 'module-a' },
        { id: 1, name: 'dependency-a' },
        { id: 2, name: 'dependency-b' },
      ],
    });
  });
});
