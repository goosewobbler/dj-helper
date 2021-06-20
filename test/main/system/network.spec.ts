import network from '../../../src/main/system/network';
import { Response } from '../../../src/common/types';

function mockFetch({
  data,
  headers,
  statusText,
  status = 200,
  ok = true,
}: {
  headers: Headers;
  data: string;
  ok?: boolean;
  status?: number;
  statusText: string;
}) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      headers,
      ok,
      status,
      statusText,
      text: () => Promise.resolve(data),
    }),
  );
}

describe('get', () => {
  const headers = new Headers({
    'Content-Type': 'text/plain',
    'Content-Length': '11',
    'X-Custom-Header': 'LookACustomHeader',
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      global.fetch = mockFetch({ headers, data: 'test', statusText: 'OK' });
    });

    it('should call fetch with the expected parameters', async () => {
      await network.get('https://www.bbc.co.uk');
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://www.bbc.co.uk', { method: 'GET' });
    });

    it('should resolve with the expected parameters', async () => {
      const response = (await network.get('https://www.bbc.co.uk')) as Response;
      expect(response).toEqual({ statusCode: 200, headers, body: 'test' });
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      global.fetch = mockFetch({ headers, data: 'test error', ok: false, status: 500, statusText: 'server fail' });
    });

    it('should call fetch with the expected parameters', async () => {
      try {
        await network.get('https://www.bbc.co.uk');
      } catch (e) {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://www.bbc.co.uk', { method: 'GET' });
      }
    });

    it('should reject with the expected parameters', async () => {
      try {
        await network.get('https://www.bbc.co.uk');
      } catch ({ message, response }) {
        expect(message).toEqual('server fail');
        expect(response).toEqual({ statusCode: 500, headers, body: 'test error' });
      }
    });
  });
});
