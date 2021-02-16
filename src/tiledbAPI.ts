import { UserApi } from "@tiledb-inc/tiledb-cloud";
import { requestAPI } from "./handler";

const getTileDBAPI = async () => {
  const data: any = await requestAPI();
  const config = {
    apiKey: data.token,
  };
  return new UserApi(config);
};

export default getTileDBAPI;
