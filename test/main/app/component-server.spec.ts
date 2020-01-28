/* eslint-disable @typescript-eslint/unbound-method */
import * as request from 'supertest';
import express from 'express';

import createServer from '../../../src/main/app/componentServer';
import createMockService from '../mocks/service';
import mockConfig from '../mocks/config';
import { Service } from '../../../src/common/types';

describe('when a given component is not running', () => {
  let server: express.Express;
  let mockService: Service;

  beforeEach(() => {
    mockService = createMockService('Component is not running', {}, 500);
    server = createServer(mockService, mockConfig);
  });

  it('cannot request a data component', () =>
    request(server)
      .get('/data/bbc-morph-baz')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(500)
      .then((response: request.Response): void => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(response.text).toEqual('Component is not running');
      }));

  it('cannot request a view component', () =>
    request(server)
      .get('/view/bbc-morph-baz')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(500)
      .then((response: request.Response): void => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(response.text).toEqual('Component is not running');
      }));

  it('cannot proxy a component', () =>
    request(server)
      .get('/proxy/bbc-morph-baz')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(500)
      .then((response: request.Response): void => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, false);
        expect(response.text).toEqual('Component is not running');
      }));
});

describe('when a given component is running', () => {
  let server: express.Express;
  let mockService: Service;

  beforeEach(() => {
    mockService = createMockService('{ "baz": "123" }', {}, 200);
    server = createServer(mockService, mockConfig);
  });

  it('can request a data component without props', () =>
    request(server)
      .get('/data/bbc-morph-baz')
      .expect(200)
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(JSON.parse(response.text)).toEqual({ baz: '123' });
      }));

  it('can request a data component with props', () =>
    request(server)
      .get('/data/bbc-morph-baz/a/1/b%2Fb/2%202/c/3')
      .expect(200)
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith(
          'bbc-morph-baz',
          {
            'a': '1',
            'b/b': '2 2',
            'c': '3',
          },
          true,
        );
        expect(JSON.parse(response.text)).toEqual({ baz: '123' });
      }));
});

// it('can request view component without props', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/view/bbc-morph-bar', '{ "bodyInline": "<h1>Hello bar</h1>" }');
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-bar');

//   return request(server)
//     .get('/view/bbc-morph-bar')
//     .expect('Content-Type', 'text/html; charset=utf-8')
//     .expect(200)
//     .then((response: Response) => {
//       expect(response.text).toContain('<h1>Hello bar</h1>');
//     });
// });

// it('can request view component with props', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8083/view/bbc-morph-bar/hello/world',
//         '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-bar');

//   return request(server)
//     .get('/view/bbc-morph-bar/hello/world')
//     .expect('Content-Type', 'text/html; charset=utf-8')
//     .expect(200)
//     .then((response: Response) => {
//       expect(response.text).toContain('<h1>Hello bar with props</h1>');
//     });
// });

// it('can proxy data requests without props', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8085/data/bbc-morph-baz',
//         '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-foo');
//   await service.start('bbc-morph-bar');
//   await service.start('bbc-morph-baz');

//   return request(server)
//     .get('/proxy/bbc-morph-baz')
//     .expect(200)
//     .then((response: Response) => {
//       expect(JSON.parse(response.text)).toEqual({
//         bodyInline: 'Something using localhost:8085/thing',
//         foo: 'Something else using http://localhost:8085',
//       });
//     });
// });

// it('can proxy data requests with props', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8085/data/bbc-morph-baz/hello/world',
//         '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-foo');
//   await service.start('bbc-morph-bar');
//   await service.start('bbc-morph-baz');

//   return request(server)
//     .get('/proxy/bbc-morph-baz/hello/world')
//     .expect(200)
//     .then((response: Response) => {
//       expect(JSON.parse(response.text)).toEqual({
//         bodyInline: 'Something using localhost:8085/thing',
//         foo: 'Something else using http://localhost:8085',
//       });
//     });
// });

// it('can proxy view requests without props', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8084/view/bbc-morph-bar',
//         '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-foo');
//   await service.start('bbc-morph-bar');

//   return request(server)
//     .get('/proxy/bbc-morph-bar')
//     .expect(200)
//     .then((response: Response) => {
//       expect(JSON.parse(response.text)).toEqual({
//         bodyInline: 'Something using localhost:8084/thing',
//         foo: 'Something else using http://localhost:8084',
//       });
//     });
// });

// it('can proxy view requests with props', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8084/view/bbc-morph-bar/hello/world',
//         '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-foo');
//   await service.start('bbc-morph-bar');

//   return request(server)
//     .get('/proxy/bbc-morph-bar/hello/world')
//     .expect(200)
//     .then((response: Response) => {
//       expect(JSON.parse(response.text)).toEqual({
//         bodyInline: 'Something using localhost:8084/thing',
//         foo: 'Something else using http://localhost:8084',
//       });
//     });
// });

// it('view response is wrapped in live reloading page', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8083/view/bbc-morph-bar/hello/world',
//         '{ "head": ["<link>head1</link>", "<link>head2</link>"], "bodyInline": "<h1>Hello bar with props</h1>", "bodyLast": ["<p>bodylast1</p>", "<p>bodylast2</p>"] }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-bar');

//   return request(server)
//     .get('/view/bbc-morph-bar/hello/world')
//     .expect('Content-Type', 'text/html; charset=utf-8')
//     .expect(200)
//     .then((response: Response) => {
//       expect(response.text).toBe(
//         '<!doctype html><html class="b-pw-1280"><head><meta charset="utf-8"><meta http-equiv="x-ua-compatible" content="ie=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="shortcut icon" type="image/png" href="http://localhost:3333/image/icon/morph.png"/><script src="http://localhost:3333/socket.io/socket.io.js"></script><link>head1</link><link>head2</link><style>body {font-size: 62.5%;line-height: 1;}</style></head><body><h1>Hello bar with props</h1><script src="//m.int.files.bbci.co.uk/modules/vendor/requirejs/2.1.20/require.min.js"></script><p>bodylast1</p><p>bodylast2</p><script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script></body></html>',
//       );
//     });
// });

// it('data component request forwards status code and headers', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz', '{ "baz": 123 }', 222, { custom: 'header' });
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-baz');

//   return request(server)
//     .get('/data/bbc-morph-baz')
//     .expect(222)
//     .expect('custom', 'header')
//     .then((response: Response) => {
//       expect(JSON.parse(response.text)).toEqual({ baz: 123 });
//     });
// });

// it('view component request forwards status code and headers and does not create page for non 200 responses', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/view/bbc-morph-bar', 'hello', 222, { custom: 'header' });
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-bar');

//   return request(server)
//     .get('/view/bbc-morph-bar')
//     .expect('Content-Type', 'text/html; charset=utf-8')
//     .expect(222)
//     .expect('custom', 'header')
//     .then((response: Response) => {
//       expect(response.text).toBe('hello');
//     });
// });

// it('proxy data request forwards status code and headers', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz', '{"hello": "world"}', 222, {
//         custom: 'header',
//       });
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-baz');

//   return request(server)
//     .get('/proxy/bbc-morph-baz')
//     .expect(222)
//     .expect('custom', 'header')
//     .then((response: Response) => {
//       expect(JSON.parse(response.text)).toEqual({ hello: 'world' });
//     });
// });

// it('proxy view request forwards status code and headers', async () => {
//   const { service } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/view/bbc-morph-bar', '{"hello": "world"}', 222, {
//         custom: 'header',
//       });
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-bar');

//   return request(server)
//     .get('/proxy/bbc-morph-bar')
//     .expect(222)
//     .expect('custom', 'header')
//     .then((response: Response) => {
//       expect(JSON.parse(response.text)).toEqual({ hello: 'world' });
//     });
// });

// it('history is updated on data request', async () => {
//   const { service, onComponentUpdate } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz/a/1', '{ "baz": 123 }');
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-baz');
//   await request(server).get('/data/bbc-morph-baz/a/1');

//   expect(onComponentUpdate).toHaveBeenCalledWith(
//     expect.objectContaining({
//       history: ['/a/1'],
//       name: 'bbc-morph-baz',
//     }),
//   );
// });

// it('history is updated on view request', async () => {
//   const { service, onComponentUpdate } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8083/view/bbc-morph-bar/hello/world',
//         '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-bar');
//   await request(server).get('/view/bbc-morph-bar/hello/world');

//   expect(onComponentUpdate).toHaveBeenCalledWith(
//     expect.objectContaining({
//       history: ['/hello/world'],
//       name: 'bbc-morph-bar',
//     }),
//   );
// });

// it('history is not updated on proxy request', async () => {
//   const { service, onComponentUpdate } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz/b/2', '123');
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-baz');
//   await request(server).get('/proxy/bbc-morph-baz/b/2');

//   expect(onComponentUpdate).not.toHaveBeenCalledWith(
//     expect.objectContaining({
//       history: ['/b/2'],
//       name: 'bbc-morph-baz',
//     }),
//   );
// });

// it('history is not updated on data request when Accept header exists does not contain text/html', async () => {
//   const { service, onComponentUpdate } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz/a/1', '{ "baz": 123 }');
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-baz');
//   await request(server)
//     .get('/data/bbc-morph-baz/a/1')
//     .set('Accept', '*/*');

//   expect(onComponentUpdate).not.toHaveBeenCalledWith(
//     expect.objectContaining({
//       history: ['/a/1'],
//       name: 'bbc-morph-baz',
//     }),
//   );
// });

// it('history is not updated on view request when Accept header exists does not contain text/html', async () => {
//   const { service, onComponentUpdate } = await createMockService({
//     systemModifier: builder => {
//       builder.withGetResponse(
//         'http://localhost:8083/view/bbc-morph-bar/hello/world',
//         '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
//       );
//     },
//   });
//   const server = createServer(service);
//   await service.start('bbc-morph-bar');
//   await request(server)
//     .get('/view/bbc-morph-bar/hello/world')
//     .set('Accept', '*/*');

//   expect(onComponentUpdate).not.toHaveBeenCalledWith(
//     expect.objectContaining({
//       history: ['/hello/world'],
//       name: 'bbc-morph-bar',
//     }),
//   );
// });
