/* eslint-disable @typescript-eslint/unbound-method */
import * as request from 'supertest';
import express from 'express';
import createServer from '../../../src/main/app/componentServer';
import createMockService from '../mocks/service';
import mockConfig from '../mocks/config';
import { Service } from '../../../src/common/types';

let server: express.Express;
let mockService: Service;

const mockServiceRequest = (body: string, headers: Record<string, string>, statusCode: number): void => {
  (mockService.request as jest.Mock).mockReturnValueOnce(
    Promise.resolve({
      body,
      headers,
      statusCode,
    }),
  );
};

beforeEach(() => {
  mockService = createMockService();
  server = createServer(mockService, mockConfig);
});

afterEach(() => {
  (mockService.request as jest.Mock).mockReset();
});

describe('when a given component is not running', () => {
  beforeEach(() => {
    mockServiceRequest('Component is not running', {}, 500);
  });

  it('cannot request a data component', done =>
    request(server)
      .get('/data/bbc-morph-baz')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(500)
      .then((response: request.Response): void => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(response.text).toEqual('Component is not running');
      })
      .then(done));

  it('cannot request a view component', done =>
    request(server)
      .get('/view/bbc-morph-baz')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(500)
      .then((response: request.Response): void => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(response.text).toEqual('Component is not running');
      })
      .then(done));

  it('cannot proxy a component', done =>
    request(server)
      .get('/proxy/bbc-morph-baz')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(500)
      .then((response: request.Response): void => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, false);
        expect(response.text).toEqual('Component is not running');
      })
      .then(done));
});

describe('given a data component is running', () => {
  beforeEach(() => {
    mockServiceRequest('{ "baz": "123" }', {}, 200);
  });

  it('can be requested without props', done =>
    request(server)
      .get('/data/bbc-morph-baz')
      .expect(200)
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(JSON.parse(response.text)).toEqual({ baz: '123' });
      })
      .then(done));

  it('can be requested with props', done =>
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
      })
      .then(done));

  it('correctly handles errors', done => {
    (mockService.request as jest.Mock).mockReset();
    (mockService.request as jest.Mock).mockImplementationOnce(() => {
      throw new Error('erhmahgerd');
    });
    return request(server)
      .get('/data/bbc-morph-baz')
      .expect(500)
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(response.text).toEqual('erhmahgerd');
      })
      .then(done);
  });

  it('can be proxied without props', done =>
    request(server)
      .get('/proxy/bbc-morph-baz')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, false);
        expect(JSON.parse(response.text)).toEqual({ baz: '123' });
      })
      .then(done));

  it('can be proxied with props', done =>
    request(server)
      .get('/proxy/bbc-morph-baz/a/1/b%2Fb/2%202/c/3')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith(
          'bbc-morph-baz',
          {
            'a': '1',
            'b/b': '2 2',
            'c': '3',
          },
          false,
        );
        expect(JSON.parse(response.text)).toEqual({ baz: '123' });
      })
      .then(done));

  it('correctly handles errors when proxied', done => {
    (mockService.request as jest.Mock).mockReset();
    (mockService.request as jest.Mock).mockImplementationOnce(() => {
      throw new Error('erhmahgerd');
    });
    return request(server)
      .get('/proxy/bbc-morph-baz')
      .expect(500)
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, false);
        expect(response.text).toEqual('erhmahgerd');
      })
      .then(done);
  });
});

describe('given a data component is running and returning non-200 with custom headers', () => {
  beforeEach(() => {
    mockServiceRequest('{ "baz": "123" }', { custom: 'header' }, 222);
  });

  it('correctly forwards status code and headers when requested', done =>
    request(server)
      .get('/data/bbc-morph-baz')
      .expect(222)
      .expect('custom', 'header')
      .then((response: request.Response) => {
        expect(JSON.parse(response.text)).toEqual({ baz: '123' });
      })
      .then(done));

  it('correctly forwards status code and headers when proxied', done =>
    request(server)
      .get('/proxy/bbc-morph-baz')
      .expect(222)
      .expect('custom', 'header')
      .then((response: request.Response) => {
        expect(JSON.parse(response.text)).toEqual({ baz: '123' });
      })
      .then(done));
});

describe('given a view component is running', () => {
  beforeEach(() => {
    mockServiceRequest(
      '{ "head": ["<link>head1</link>", "<link>head2</link>"], "bodyInline": "<h1>Hello</h1>", "bodyLast": ["<p>bodylast1</p>", "<p>bodylast2</p>"] }',
      {},
      200,
    );
  });

  it('can be requested without props', done =>
    request(server)
      .get('/view/bbc-morph-baz')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(response.text).toContain('<h1>Hello</h1>');
        expect(response.text).toMatchSnapshot();
      })
      .then(done));

  it('can be requested with props', done =>
    request(server)
      .get('/view/bbc-morph-baz/hello/world')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith(
          'bbc-morph-baz',
          {
            hello: 'world',
          },
          true,
        );
        expect(response.text).toContain('<h1>Hello</h1>');
        expect(response.text).toMatchSnapshot();
      })
      .then(done));

  it('correctly handles errors', done => {
    (mockService.request as jest.Mock).mockReset();
    (mockService.request as jest.Mock).mockImplementationOnce(() => {
      throw new Error('erhmahgerd');
    });
    return request(server)
      .get('/view/bbc-morph-baz')
      .expect(500)
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, true);
        expect(response.text).toEqual('erhmahgerd');
      })
      .then(done);
  });

  it('can be proxied without props', done =>
    request(server)
      .get('/proxy/bbc-morph-baz')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, false);
        expect(response.text).toContain('<h1>Hello</h1>');
      })
      .then(done));

  it('can be proxied with props', done =>
    request(server)
      .get('/proxy/bbc-morph-baz/hello/world')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith(
          'bbc-morph-baz',
          {
            hello: 'world',
          },
          false,
        );
        expect(response.text).toContain('<h1>Hello</h1>');
      })
      .then(done));

  it('correctly handles errors when proxied', done => {
    (mockService.request as jest.Mock).mockReset();
    (mockService.request as jest.Mock).mockImplementationOnce(() => {
      throw new Error('erhmahgerd');
    });
    return request(server)
      .get('/proxy/bbc-morph-baz')
      .expect(500)
      .then((response: request.Response) => {
        expect(mockService.request).toHaveBeenCalledWith('bbc-morph-baz', {}, false);
        expect(response.text).toEqual('erhmahgerd');
      })
      .then(done);
  });
});

describe('given a view component is running and returning non-200 with custom headers', () => {
  beforeEach(() => {
    mockServiceRequest('non-200 response', { custom: 'header' }, 222);
  });

  it('correctly forwards status code and headers and returns an unwrapped body when requested', done =>
    request(server)
      .get('/view/bbc-morph-baz')
      .expect(222)
      .expect('custom', 'header')
      .then((response: request.Response) => {
        expect(response.text).toEqual('non-200 response');
      })
      .then(done));

  it('correctly forwards status code and headers and returns an unwrapped body when proxied', done =>
    request(server)
      .get('/proxy/bbc-morph-baz')
      .expect(222)
      .expect('custom', 'header')
      .then((response: request.Response) => {
        expect(response.text).toEqual('non-200 response');
      })
      .then(done));
});

describe('local-push.js', () => {
  describe('when there is a config value set for livePushPollInterval', () => {
    beforeEach(() => {
      mockConfig.get.mockReturnValue('42');
    });

    it('returns the file with the expected poll interval', done =>
      request(server)
        .get('/local-push.js')
        .expect(200)
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .then((response: request.Response) => {
          expect(mockConfig.get).toHaveBeenCalledWith('livePushPollInterval');
          expect(response.text).toContain('intervals[topic] = setInterval(poll, 42);');
          expect(response.text).toMatchSnapshot();
        })
        .then(done));
  });

  describe('when there is no config value set for livePushPollInterval', () => {
    beforeEach(() => {
      mockConfig.get.mockReturnValue(undefined);
    });

    it('returns the file with the default poll interval', done =>
      request(server)
        .get('/local-push.js')
        .expect(200)
        .expect('Content-Type', 'application/javascript; charset=utf-8')
        .then((response: request.Response) => {
          expect(mockConfig.get).toHaveBeenCalledWith('livePushPollInterval');
          expect(response.text).toContain('intervals[topic] = setInterval(poll, 10000);');
          expect(response.text).toMatchSnapshot();
        })
        .then(done));
  });
});
