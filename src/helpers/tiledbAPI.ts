import { requestAPI } from './handler';

const API_VERSION = 'v1';

let data: any;

interface Config {
  apiKey: string;
  basePath: string;
}
interface Constructable<T> {
  new (c: Config): T;
}

const getTileDBAPI = async <T>(Api: Constructable<T>): Promise<T> => {
  if (!data) {
    data = await requestAPI();
  }
  const config: Config = {
    apiKey: data.token,
    basePath: `${data.api_host}/${API_VERSION}`,
  };
  return new Api(config);
};

export default getTileDBAPI;
