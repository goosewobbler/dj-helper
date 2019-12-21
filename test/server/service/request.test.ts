import CreateType from '../../../src/server/types/CreateType';
import createMockService from '../mocks/service';

test('can request a component with no props', async () => {
  const { service, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder
        .withGetResponse('http://localhost:8083/data/bbc-morph-foo', '{ "bodyInline": "<h1>Hello foo</h1>" }', 123, {
          foo: '123',
        })
        .withGetResponse('http://localhost:8084/view/bbc-morph-bar', '{ "bodyInline": "<h1>Hello bar</h1>" }', 456, {
          bar: '456',
        })
        .withGetResponse('http://localhost:8085/data/bbc-morph-baz', '{ "baz": 123 }', 789, { baz: '789' });
    },
  });

  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');
  await service.start('bbc-morph-baz');

  const responseFoo = await service.request('bbc-morph-foo', {}, false);
  const responseBar = await service.request('bbc-morph-bar', {}, false);
  const responseBaz = await service.request('bbc-morph-baz', {}, false);

  expect(responseFoo).toEqual({
    body: '{ "bodyInline": "<h1>Hello foo</h1>" }',
    headers: { foo: '123' },
    statusCode: 123,
  });
  expect(responseBar).toEqual({
    body: '{ "bodyInline": "<h1>Hello bar</h1>" }',
    headers: { bar: '456' },
    statusCode: 456,
  });
  expect(responseBaz).toEqual({ body: '{ "baz": 123 }', headers: { baz: '789' }, statusCode: 789 });

  expect(systemBuilder.getLogs()).toEqual(
    expect.arrayContaining([
      '[foo] Requesting http://localhost:8083/data/bbc-morph-foo',
      '[bar] Requesting http://localhost:8084/view/bbc-morph-bar',
      '[baz] Requesting http://localhost:8085/data/bbc-morph-baz',
    ]),
  );
});

test('can request a component with props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder
        .withGetResponse(
          'http://localhost:8083/data/bbc-morph-foo/a%20bc/123/def/4%205%206',
          '{ "bodyInline": "<h1>Hello foo with props</h1>" }',
          123,
          { foo: '123' },
        )
        .withGetResponse(
          'http://localhost:8084/view/bbc-morph-bar/xyz/true',
          '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
          456,
          { bar: '456' },
        )
        .withGetResponse('http://localhost:8085/data/bbc-morph-baz/a/1/b/2/c/3', '{ "baz": 123, "props": true }', 789, {
          baz: '789',
        });
    },
  });

  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');
  await service.start('bbc-morph-baz');

  const responseFoo = await service.request('bbc-morph-foo', { 'a bc': '123', def: '4 5 6' }, false);
  const responseBar = await service.request('bbc-morph-bar', { xyz: 'true' }, false);
  const responseBaz = await service.request('bbc-morph-baz', { a: '1', b: '2', c: '3' }, false);

  expect(responseFoo).toEqual({
    body: '{ "bodyInline": "<h1>Hello foo with props</h1>" }',
    headers: { foo: '123' },
    statusCode: 123,
  });
  expect(responseBar).toEqual({
    body: '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
    headers: { bar: '456' },
    statusCode: 456,
  });
  expect(responseBaz).toEqual({ body: '{ "baz": 123, "props": true }', headers: { baz: '789' }, statusCode: 789 });
});

test('cannot request a component that is not running', async () => {
  const { service } = await createMockService();

  let caughtFooError: any;
  let caughtBarError: any;
  let caughtBazError: any;

  try {
    await service.request('bbc-morph-foo', { abc: '123', def: '4 5 6' }, false);
  } catch (ex) {
    caughtFooError = ex;
  }

  try {
    await service.request('bbc-morph-bar', { xyz: 'true' }, false);
  } catch (ex) {
    caughtBarError = ex;
  }

  try {
    await service.request('bbc-morph-baz', { a: '1', b: '2', c: '3' }, false);
  } catch (ex) {
    caughtBazError = ex;
  }

  expect(caughtFooError.message).toBe('Component is not running');
  expect(caughtBarError.message).toBe('Component is not running');
  expect(caughtBazError.message).toBe('Component is not running');
});

test('all localhost:8082 occurrences are replaced with correct port', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder
        .withReadFile('/test/components/new/package.json', '{}')
        .withGetResponse(
          'http://localhost:8084/data/bbc-morph-foo',
          '{ "bodyInline": "<h1>Hello foo http://localhost:8082/foo</h1>", "foo": "localhost:8082" }',
          123,
          { foo: '123' },
        )
        .withGetResponse(
          'http://localhost:8085/view/bbc-morph-bar',
          '{ "bodyInline": "<h1>Hello http://localhost:8082/bar</h1>", "bar": "localhost:8082" }',
          456,
          { bar: '456' },
        )
        .withGetResponse(
          'http://localhost:8086/data/bbc-morph-baz',
          '{ "thing": "Something using http://localhost:8082/bar", "baz": localhost:8082 }',
          789,
          { baz: '789' },
        );
    },
  });

  await service.create('new', CreateType.Data, { description: 'new' });
  await service.start('bbc-morph-new');
  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');
  await service.start('bbc-morph-baz');

  const responseFoo = await service.request('bbc-morph-foo', {}, false);
  const responseBar = await service.request('bbc-morph-bar', {}, false);
  const responseBaz = await service.request('bbc-morph-baz', {}, false);

  expect(responseFoo).toEqual({
    body: '{ "bodyInline": "<h1>Hello foo http://localhost:8084/foo</h1>", "foo": "localhost:8084" }',
    headers: { foo: '123' },
    statusCode: 123,
  });
  expect(responseBar).toEqual({
    body: '{ "bodyInline": "<h1>Hello http://localhost:8085/bar</h1>", "bar": "localhost:8085" }',
    headers: { bar: '456' },
    statusCode: 456,
  });
  expect(responseBaz).toEqual({
    body: '{ "thing": "Something using http://localhost:8086/bar", "baz": localhost:8086 }',
    headers: { baz: '789' },
    statusCode: 789,
  });
});

test('all minified react require references are replaced with dev versions', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo',
        `requirejs.config({ paths: { 'morph/react' : '//m.files.bbci.co.uk/modules/vendor-react/1.0.0/react.min', 'morph/react-dom' : '//m.files.bbci.co.uk/modules/vendor-react-dom/1.0.0/react-dom.min', ... requirejs.config({ paths: { 'morph/react' : '//m.files.bbci.co.uk/modules/vendor-react/1.0.0/react.min', 'morph/react-dom' : '//m.files.bbci.co.uk/modules/vendor-react-dom/1.0.0/react-dom.min', ...`,
      );
    },
  });

  await service.start('bbc-morph-foo');

  const responseFoo = await service.request('bbc-morph-foo', {}, false);

  expect(responseFoo).toEqual({
    body: `requirejs.config({ paths: { 'morph/react' : '//m.files.bbci.co.uk/modules/vendor-react/1.0.0/react', 'morph/react-dom' : '//m.files.bbci.co.uk/modules/vendor-react-dom/1.0.0/react-dom', ... requirejs.config({ paths: { 'morph/react' : '//m.files.bbci.co.uk/modules/vendor-react/1.0.0/react', 'morph/react-dom' : '//m.files.bbci.co.uk/modules/vendor-react-dom/1.0.0/react-dom', ...`,
    headers: {},
    statusCode: 200,
  });
});

test('all live push require references are replaced with local version', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/view/bbc-morph-bar',
        `requirejs.config({ 'live-push' : '//m.files.bbci.co.uk/modules/morph-local-live-push/1.3.3/local-push' }, shim: 'live-push' : '//m.files.bbci.co.uk/modules/morph-local-live-push/20.3.4/local-push', 'live-push' : '//push.api.bbci.co.uk/public/client', 'live-push' : '//push.test.api.bbci.co.uk/public/client' }, shim: , ...`,
      );
    },
  });

  await service.start('bbc-morph-bar');

  const responseBar = await service.request('bbc-morph-bar', {}, false);

  expect(responseBar).toEqual({
    body: `requirejs.config({ 'live-push' : '//localhost:3333/local-push' }, shim: 'live-push' : '//localhost:3333/local-push', 'live-push' : '//localhost:3333/local-push', 'live-push' : '//localhost:3333/local-push' }, shim: , ...`,
    headers: {},
    statusCode: 200,
  });
});

test('failed requests with unsuccessful dependencies are retried 10 times by default', async () => {
  const { service, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder
        .withReadFile('/test/components/new/package.json', '{}')
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template had dependencies that required success but were not successful ...reason1',
        )
        .withEphemeralGetResponse('http://localhost:8084/data/bbc-morph-foo/a/1/b/2', 'Finally working response', 123, {
          foo: '123',
        });
    },
  });

  await service.create('new', CreateType.Data, { description: 'new' });
  await service.start('bbc-morph-new');
  await service.start('bbc-morph-foo');

  const responseFoo = await service.request('bbc-morph-foo', { a: '1', b: '2' }, false);

  expect(responseFoo).toEqual({
    body: 'Finally working response',
    headers: { foo: '123' },
    statusCode: 123,
  });

  expect(systemBuilder.getLogs()).toEqual(
    expect.arrayContaining([
      '[foo] Trying again because: Template had dependencies that required success but were not successful ...reason1 (9 retries remaining).',
    ]),
  );
});

test('failed requests with unsuccessful dependencies are retried a number of times defined in config', async () => {
  const { service, config, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder
        .withReadFile('/test/components/new/package.json', '{}')
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template had dependencies that required success but were not successful ...reason1\nignored new \nlines',
        )
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template had dependencies that required success but were not successful ...reason2',
        )
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template had dependencies that required success but were not successful ...reason3',
        )
        .withEphemeralGetResponse('http://localhost:8084/data/bbc-morph-foo/a/1/b/2', 'Finally working response', 123, {
          foo: '123',
        });
    },
  });

  await config.setValue('retries', 3);
  await service.create('new', CreateType.Data, { description: 'new' });
  await service.start('bbc-morph-new');
  await service.start('bbc-morph-foo');

  const responseFoo = await service.request('bbc-morph-foo', { a: '1', b: '2' }, false);

  expect(responseFoo).toEqual({
    body: 'Finally working response',
    headers: { foo: '123' },
    statusCode: 123,
  });

  expect(systemBuilder.getLogs()).toEqual(
    expect.arrayContaining([
      '[foo] Trying again because: Template had dependencies that required success but were not successful ...reason1 (2 retries remaining).',
      '[foo] Trying again because: Template had dependencies that required success but were not successful ...reason2 (1 retry remaining).',
      '[foo] Trying again because: Template had dependencies that required success but were not successful ...reason3 (0 retries remaining).',
    ]),
  );
});

test('failed requests with unsuccessful dependencies return the most recent response if no more retries remaining', async () => {
  const { service, config, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder
        .withReadFile('/test/components/new/package.json', '{}')
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template had dependencies that required success but were not successful ...reason1',
        )
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template had dependencies that required success but were not successful ...reason2',
        )
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template had dependencies that required success but were not successful ...reason3',
        )
        .withEphemeralGetResponse('http://localhost:8084/data/bbc-morph-foo/a/1/b/2', 'Finally working response', 123, {
          foo: '123',
        });
    },
  });

  await config.setValue('retries', 2);
  await service.create('new', CreateType.Data, { description: 'new' });
  await service.start('bbc-morph-new');
  await service.start('bbc-morph-foo');

  const responseFoo = await service.request('bbc-morph-foo', { a: '1', b: '2' }, false);

  expect(responseFoo).toEqual({
    body: 'Template had dependencies that required success but were not successful ...reason3',
    headers: {},
    statusCode: 200,
  });

  expect(systemBuilder.getLogs()).toEqual(
    expect.arrayContaining([
      '[foo] Trying again because: Template had dependencies that required success but were not successful ...reason1 (1 retry remaining).',
      '[foo] Trying again because: Template had dependencies that required success but were not successful ...reason2 (0 retries remaining).',
    ]),
  );
});

test('failed requests with missing dependencies are retried a number of times defined in config', async () => {
  const { service, config, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder
        .withReadFile('/test/components/new/package.json', '{}')
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template has these missing dependencies ...reason1\nignored new \nlines',
        )
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template has these missing dependencies ...reason2',
        )
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Template has these missing dependencies ...reason3',
        )
        .withEphemeralGetResponse('http://localhost:8084/data/bbc-morph-foo/a/1/b/2', 'Finally working response', 123, {
          foo: '123',
        });
    },
  });

  await config.setValue('retries', 3);
  await service.create('new', CreateType.Data, { description: 'new' });
  await service.start('bbc-morph-new');
  await service.start('bbc-morph-foo');

  const responseFoo = await service.request('bbc-morph-foo', { a: '1', b: '2' }, false);

  expect(responseFoo).toEqual({
    body: 'Finally working response',
    headers: { foo: '123' },
    statusCode: 123,
  });

  expect(systemBuilder.getLogs()).toEqual(
    expect.arrayContaining([
      '[foo] Trying again because: Template has these missing dependencies ...reason1 (2 retries remaining).',
      '[foo] Trying again because: Template has these missing dependencies ...reason2 (1 retry remaining).',
      '[foo] Trying again because: Template has these missing dependencies ...reason3 (0 retries remaining).',
    ]),
  );
});

test('failed requests due to ECONNREFUSED are retried a number of times defined in config', async () => {
  const { service, config, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder
        .withReadFile('/test/components/new/package.json', '{}')
        .withEphemeralGetResponse(
          'http://localhost:8084/data/bbc-morph-foo/a/1/b/2',
          'Fail ECONNREFUSED ...reason1\nignored new \nlines',
        )
        .withEphemeralGetResponse('http://localhost:8084/data/bbc-morph-foo/a/1/b/2', 'Fail ECONNREFUSED ...reason2')
        .withEphemeralGetResponse('http://localhost:8084/data/bbc-morph-foo/a/1/b/2', 'Fail ECONNREFUSED ...reason3')
        .withEphemeralGetResponse('http://localhost:8084/data/bbc-morph-foo/a/1/b/2', 'Finally working response', 123, {
          foo: '123',
        });
    },
  });

  await config.setValue('retries', 3);
  await service.create('new', CreateType.Data, { description: 'new' });
  await service.start('bbc-morph-new');
  await service.start('bbc-morph-foo');

  const responseFoo = await service.request('bbc-morph-foo', { a: '1', b: '2' }, false);

  expect(responseFoo).toEqual({
    body: 'Finally working response',
    headers: { foo: '123' },
    statusCode: 123,
  });

  expect(systemBuilder.getLogs()).toEqual(
    expect.arrayContaining([
      '[foo] Trying again because: Fail ECONNREFUSED ...reason1 (2 retries remaining).',
      '[foo] Trying again because: Fail ECONNREFUSED ...reason2 (1 retry remaining).',
      '[foo] Trying again because: Fail ECONNREFUSED ...reason3 (0 retries remaining).',
    ]),
  );
});

test('version prop is removed from request', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder
        .withGetResponse(
          'http://localhost:8083/data/bbc-morph-foo/a%20bc/123/def/4%205%206',
          '{ "bodyInline": "<h1>Hello foo with props</h1>" }',
          123,
          { foo: '123' },
        )
        .withGetResponse(
          'http://localhost:8084/view/bbc-morph-bar/xyz/true',
          '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
          456,
          { bar: '456' },
        )
        .withGetResponse('http://localhost:8085/data/bbc-morph-baz/a/1/b/2/c/3', '{ "baz": 123, "props": true }', 789, {
          baz: '789',
        });
    },
  });

  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');
  await service.start('bbc-morph-baz');

  const responseFoo = await service.request('bbc-morph-foo', { 'a bc': '123', def: '4 5 6', version: '1.2.3' }, false);
  const responseBar = await service.request('bbc-morph-bar', { xyz: 'true', version: '7.0.0' }, false);
  const responseBaz = await service.request('bbc-morph-baz', { a: '1', b: '2', c: '3', version: 'hello' }, false);

  expect(responseFoo).toEqual({
    body: '{ "bodyInline": "<h1>Hello foo with props</h1>" }',
    headers: { foo: '123' },
    statusCode: 123,
  });
  expect(responseBar).toEqual({
    body: '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
    headers: { bar: '456' },
    statusCode: 456,
  });
  expect(responseBaz).toEqual({ body: '{ "baz": 123, "props": true }', headers: { baz: '789' }, statusCode: 789 });
});

test('can request view using Chas if enabled', async () => {
  const { service, config } = await createMockService();

  const renderer = jest.fn().mockReturnValueOnce(
    Promise.resolve({
      body: { a: 1 },
      code: 123,
    }),
  );
  require('chas').setRenderer(renderer);

  await config.setValue('renderer', 'chas');

  await service.start('bbc-morph-bar');
  const responseBar = await service.request('bbc-morph-bar', { a: '1', b: '2' }, false);

  expect(renderer).toHaveBeenCalledTimes(1);
  expect(renderer).toHaveBeenCalledWith('/test/components/bar', 'view', { a: '1', b: '2' });
  expect(responseBar).toEqual({
    body: '{"a":1}',
    headers: { 'Content-Type': 'application/json' },
    statusCode: 123,
  });
});

test('can request data using Chas if enabled', async () => {
  const { service, config } = await createMockService();

  const renderer = jest.fn().mockReturnValueOnce(
    Promise.resolve({
      body: { a: 1 },
      code: 123,
    }),
  );
  require('chas').setRenderer(renderer);

  await config.setValue('renderer', 'chas');

  await service.start('bbc-morph-baz');
  const responseBaz = await service.request('bbc-morph-baz', { a: '1', b: '2' }, false);

  expect(renderer).toHaveBeenCalledTimes(1);
  expect(renderer).toHaveBeenCalledWith('/test/components/baz', 'data', { a: '1', b: '2' });
  expect(responseBaz).toEqual({
    body: '{"a":1}',
    headers: { 'Content-Type': 'application/json' },
    statusCode: 123,
  });
});
