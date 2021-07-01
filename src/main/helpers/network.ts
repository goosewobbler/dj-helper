import { Response, NetworkSystem } from '../../common/types';

interface ResponseError extends Error {
  response: Response;
}

const get = async (url: string): Promise<Response> => {
  let body: string;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    const { headers, status: statusCode, statusText, ok, text } = response;

    body = await text();

    if (!ok) {
      let err = new Error(statusText) as ResponseError;
      err.response = { headers, statusCode, body };
      throw err;
    }

    return Promise.resolve({ body, headers, statusCode });
  } catch (error) {
    return Promise.reject(error);
  }
};

const network: NetworkSystem = {
  get,
};

export default network;
