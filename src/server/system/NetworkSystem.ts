import * as request from 'request';
import INetworkSystem from '../types/INetworkSystem';

const get = (url: string) =>
  new Promise<{ body: string; headers: { [Key: string]: string }; statusCode: number }>((resolve, reject) =>
    request.get(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve({ body, headers: response.headers as any, statusCode: response.statusCode });
      }
    }),
  );

const NetworkSystem: INetworkSystem = {
  get,
};

export default NetworkSystem;
