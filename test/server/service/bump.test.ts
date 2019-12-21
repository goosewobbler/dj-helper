import createMockService from '../mocks/service';

test('can bump patch version', async () => {
  const { service, system, systemBuilder, onComponentUpdate } = await createMockService();

  system.git.readyToCommit = jest.fn().mockReturnValueOnce(Promise.resolve(true));
  system.git.getRandomBranchName = jest.fn().mockReturnValueOnce(Promise.resolve('123abc'));
  system.git.getCurrentBranch = jest.fn().mockReturnValueOnce(Promise.resolve('my-current-branch'));

  await service.bump('bbc-morph-bar', 'patch');

  const packageFileContents = await system.file.readFile('/test/components/bar/package.json');

  expect(JSON.parse(packageFileContents)).toEqual({
    dependencies: {
      react: '^16.0.0',
    },
    name: 'bbc-morph-bar',
    version: '2.0.1',
  });

  expect(packageFileContents[packageFileContents.length - 1]).toBe('\n');

  expect(system.git.readyToCommit).toHaveBeenCalledTimes(1);
  expect(system.git.readyToCommit).toHaveBeenCalledWith('/test/components/bar');

  expect(system.git.checkoutMaster).toHaveBeenCalledTimes(1);
  expect(system.git.checkoutMaster).toHaveBeenCalledWith('/test/components/bar');

  expect(system.git.getCurrentBranch).toHaveBeenCalledTimes(1);
  expect(system.git.getCurrentBranch).toHaveBeenCalledWith('/test/components/bar');

  expect(system.git.checkoutNewBranch).toHaveBeenCalledTimes(1);
  expect(system.git.checkoutNewBranch).toHaveBeenCalledWith('/test/components/bar', 'bump-bbc-morph-bar-123abc');

  expect(system.git.stageFile).toHaveBeenCalledTimes(1);
  expect(system.git.stageFile).toHaveBeenCalledWith('/test/components/bar', 'package.json');

  expect(system.git.commit).toHaveBeenCalledTimes(1);
  expect(system.git.commit).toHaveBeenCalledWith('/test/components/bar', 'bump bbc-morph-bar to 2.0.1');

  expect(system.git.push).toHaveBeenCalledTimes(1);
  expect(system.git.push).toHaveBeenCalledWith('/test/components/bar', 'bump-bbc-morph-bar-123abc');

  expect(system.git.checkoutExistingBranch).toHaveBeenCalledTimes(1);
  expect(system.git.checkoutExistingBranch).toHaveBeenCalledWith('/test/components/bar', 'my-current-branch');

  expect(system.process.open).toHaveBeenCalledTimes(1);
  expect(system.process.open).toHaveBeenCalledWith(
    'https://github.com/bbc/morph-modules/compare/bump-bbc-morph-bar-123abc?expand=1',
  );

  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: 'int',
      promotionFailure: null,
      versions: expect.objectContaining({
        local: null,
      }),
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: null,
      promotionFailure: null,
      versions: expect.objectContaining({
        local: '2.0.1',
      }),
    }),
  );
  expect(systemBuilder.getLogs()).toEqual(['[bar] Bumped to version 2.0.1 on branch bump-bbc-morph-bar-123abc.']);
});

test('can bump minor version', async () => {
  const { service, system, systemBuilder, onComponentUpdate } = await createMockService();

  system.git.readyToCommit = jest.fn().mockReturnValueOnce(Promise.resolve(true));
  system.git.getRandomBranchName = jest.fn().mockReturnValueOnce(Promise.resolve('xyz'));
  system.git.getCurrentBranch = jest.fn().mockReturnValueOnce(Promise.resolve('master'));

  await service.bump('bbc-morph-baz', 'minor');

  const packageFileContents = await system.file.readFile('/test/components/baz/package.json');

  expect(JSON.parse(packageFileContents)).toEqual({
    name: 'bbc-morph-baz',
    scripts: {
      build: '123',
    },
    version: '2.3.0',
  });

  expect(packageFileContents[packageFileContents.length - 1]).toBe('\n');

  expect(system.git.readyToCommit).toHaveBeenCalledTimes(1);
  expect(system.git.readyToCommit).toHaveBeenCalledWith('/test/components/baz');

  expect(system.git.checkoutMaster).toHaveBeenCalledTimes(1);
  expect(system.git.checkoutMaster).toHaveBeenCalledWith('/test/components/baz');

  expect(system.git.getCurrentBranch).toHaveBeenCalledTimes(1);
  expect(system.git.getCurrentBranch).toHaveBeenCalledWith('/test/components/baz');

  expect(system.git.checkoutNewBranch).toHaveBeenCalledTimes(1);
  expect(system.git.checkoutNewBranch).toHaveBeenCalledWith('/test/components/baz', 'bump-bbc-morph-baz-xyz');

  expect(system.git.stageFile).toHaveBeenCalledTimes(1);
  expect(system.git.stageFile).toHaveBeenCalledWith('/test/components/baz', 'package.json');

  expect(system.git.commit).toHaveBeenCalledTimes(1);
  expect(system.git.commit).toHaveBeenCalledWith('/test/components/baz', 'bump bbc-morph-baz to 2.3.0');

  expect(system.git.push).toHaveBeenCalledTimes(1);
  expect(system.git.push).toHaveBeenCalledWith('/test/components/baz', 'bump-bbc-morph-baz-xyz');

  expect(system.git.checkoutExistingBranch).toHaveBeenCalledTimes(1);
  expect(system.git.checkoutExistingBranch).toHaveBeenCalledWith('/test/components/baz', 'master');

  expect(system.process.open).toHaveBeenCalledTimes(1);
  expect(system.process.open).toHaveBeenCalledWith(
    'https://github.com/bbc/morph-modules/compare/bump-bbc-morph-baz-xyz?expand=1',
  );

  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-baz',
      promoting: 'int',
      promotionFailure: null,
      versions: expect.objectContaining({
        local: null,
      }),
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-baz',
      promoting: null,
      promotionFailure: null,
      versions: expect.objectContaining({
        local: '2.3.0',
      }),
    }),
  );
  expect(systemBuilder.getLogs()).toEqual(['[baz] Bumped to version 2.3.0 on branch bump-bbc-morph-baz-xyz.']);
});

test('show error on bump if files are already staged', async () => {
  const { service, system, systemBuilder, onComponentUpdate } = await createMockService();

  system.git.readyToCommit = jest.fn().mockReturnValueOnce(Promise.resolve(false));

  const url = await service.bump('bbc-morph-bar', 'patch');

  expect(url).toBe(null);

  const packageFileContents = JSON.parse(await system.file.readFile('/test/components/bar/package.json'));

  expect(packageFileContents).toEqual({
    dependencies: {
      react: '^16.0.0',
    },
    name: 'bbc-morph-bar',
    version: '2.0.0',
  });

  expect(system.git.readyToCommit).toHaveBeenCalledTimes(1);
  expect(system.git.readyToCommit).toHaveBeenCalledWith('/test/components/bar');

  expect(system.git.checkoutMaster).toHaveBeenCalledTimes(0);
  expect(system.git.getCurrentBranch).toHaveBeenCalledTimes(0);
  expect(system.git.checkoutNewBranch).toHaveBeenCalledTimes(0);
  expect(system.git.checkoutExistingBranch).toHaveBeenCalledTimes(0);
  expect(system.git.stageFile).toHaveBeenCalledTimes(0);
  expect(system.git.commit).toHaveBeenCalledTimes(0);
  expect(system.git.push).toHaveBeenCalledTimes(0);
  expect(system.process.open).toHaveBeenCalledTimes(0);
  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: 'int',
      promotionFailure: null,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: null,
      promotionFailure: 'Cannot bump when files are already staged for commit.',
    }),
  );
  expect(systemBuilder.getLogs()).toEqual(['[bar] Cannot bump when files are already staged for commit.']);
});

test('failure message is cleared on bump retry', async () => {
  const { service, system, onComponentUpdate } = await createMockService();

  system.git.readyToCommit = jest.fn().mockReturnValueOnce(Promise.resolve(false));

  await service.bump('bbc-morph-bar', 'minor');

  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: 'int',
      promotionFailure: null,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: null,
      promotionFailure: 'Cannot bump when files are already staged for commit.',
    }),
  );

  await service.bump('bbc-morph-bar', 'minor');

  expect(onComponentUpdate).toHaveBeenCalledTimes(4);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promotionFailure: null,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promotionFailure: 'Cannot bump when files are already staged for commit.',
    }),
  );
});
