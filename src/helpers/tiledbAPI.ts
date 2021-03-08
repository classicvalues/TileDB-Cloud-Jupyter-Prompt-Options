import { UserApi } from '@tiledb-inc/tiledb-cloud';
import { requestAPI } from './handler';

const API_VERSION = 'v1';

let data: any;

const getTileDBAPI = async (): Promise<UserApi> => {
  if (!data) {
    data = await requestAPI();
  }
  const config = {
    apiKey: data.token,
    basePath: `${data.api_host}/${API_VERSION}`,
  };
  return new UserApi(config);
};

export default getTileDBAPI;
