import { requestAPI } from './handler';

let data: any;

interface IConfig {
  apiKey: string;
  basePath: string;
}
interface IConstructable<T> {
  new (c: IConfig): T;
}

export enum Versions {
  v1 = 'v1',
  v2 = 'v2'
}

const getTileDBAPI = async <T>(
  Api: IConstructable<T>,
  apiVersion: Versions = Versions.v1
): Promise<T> => {
  if (!data) {
    data = await requestAPI();
  }
  const config: IConfig = {
    apiKey: data.token,
    basePath: `${data.api_host}/${apiVersion}`
  };
  return new Api(config);
};

export default getTileDBAPI;
