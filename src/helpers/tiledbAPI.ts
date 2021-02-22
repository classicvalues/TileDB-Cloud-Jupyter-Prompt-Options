import { UserApi } from '@tiledb-inc/tiledb-cloud';
import { requestAPI } from './handler';

const getTileDBAPI = async (): Promise<UserApi> => {
  const data: any = await requestAPI();
  const config = {
    apiKey: data.token,
    basePath: data.api_host,
  };
  return new UserApi(config);
};

export default getTileDBAPI;
