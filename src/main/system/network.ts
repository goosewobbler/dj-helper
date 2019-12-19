import request from 'request';
import { Response, NetworkSystem } from '../../common/types';

const get = (url: string): Promise<Response> =>
  new Promise(
    (resolve, reject): request.Request =>
      request.get(
        { url },
        (
          error: string[],
          response: { headers: Response['headers']; statusCode: Response['statusCode'] },
          body: Response['body'],
        ): void => {
          if (error) {
            reject(error);
          } else {
            const { headers, statusCode } = response;
            resolve({ body, headers, statusCode });
          }
        },
      ),
  );

const network: NetworkSystem = {
  get,
};

export default network;
