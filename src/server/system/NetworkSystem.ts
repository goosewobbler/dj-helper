import * as request from 'request';
import NetworkSystem from '../types/NetworkSystem';

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

const NetworkSystemExport: NetworkSystem = {
  get,
};

export default NetworkSystemExport;
