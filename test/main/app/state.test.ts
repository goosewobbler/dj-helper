import State from '../../../src/server/app/State';
import createMockSystem from '../mocks/system';

test('can store and retrieve values', async () => {
  const stateFilePath = '/file/state.json';

  const system = createMockSystem().build();

  const state = await State(stateFilePath, system);

  await state.store('foo', 'hello');
  await state.store('bar', 456);

  expect(state.retrieve('foo')).toBe('hello');
  expect(state.retrieve('bar')).toBe(456);
  expect(state.retrieve('baz')).toBe(null);
});

test('can retrieve existing values from state file', async () => {
  const stateFileContents = JSON.stringify({
    bar: 456,
    foo: 'hello',
  });

  const stateFilePath = '/file/state.json';

  const system = createMockSystem().withReadFile(stateFilePath, stateFileContents).build();

  const state = await State(stateFilePath, system);

  expect(state.retrieve('foo')).toBe('hello');
  expect(state.retrieve('bar')).toBe(456);
  expect(state.retrieve('baz')).toBe(null);
});

test('stored values are written to state file', async () => {
  const stateFilePath = '/file/state.json';

  const system = createMockSystem().build();

  const state = await State(stateFilePath, system);

  await state.store('foo', 'hello');
  await state.store('bar', 456);

  const stateFileContents = JSON.parse(await system.file.readFile(stateFilePath));

  expect(stateFileContents).toEqual({
    bar: 456,
    foo: 'hello',
  });
});

test('can unset values by setting to null', async () => {
  const stateFileContents = JSON.stringify({
    bar: 456,
    foo: 'hello',
  });

  const stateFilePath = '/file/state.json';

  const system = createMockSystem().withReadFile(stateFilePath, stateFileContents).build();

  const state = await State(stateFilePath, system);

  await state.store('foo', 'world');
  await state.store('bar', null);

  const newStateFileContents = JSON.parse(await system.file.readFile(stateFilePath));

  expect(newStateFileContents).toEqual({
    foo: 'world',
  });
});

test('can set falsey values', async () => {
  const stateFileContents = JSON.stringify({
    bar: false,
    foo: 0,
  });

  const stateFilePath = '/file/state.json';

  const system = createMockSystem().withReadFile(stateFilePath, stateFileContents).build();

  const state = await State(stateFilePath, system);

  expect(state.retrieve('foo')).toBe(0);
  expect(state.retrieve('bar')).toBe(false);

  await state.store('foo', false);
  await state.store('bar', 0);

  const newStateFileContents = JSON.parse(await system.file.readFile(stateFilePath));

  expect(newStateFileContents).toEqual({
    bar: 0,
    foo: false,
  });

  expect(state.retrieve('foo')).toBe(false);
  expect(state.retrieve('bar')).toBe(0);
});
