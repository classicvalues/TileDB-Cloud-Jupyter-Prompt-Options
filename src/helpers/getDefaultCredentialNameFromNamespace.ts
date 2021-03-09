import { UserApi, OrganizationApi } from '@tiledb-inc/tiledb-cloud';
import getTileDBAPI from './tiledbAPI';

/**
 * Returns the default_s3_path_credentials_name of the selected owner
 * @param user The user's username
 * @param owner The selected owner
 * @returns The default credentials name of the owner
 */
const getDefaultCredentialNameFromNamespace = async (
  user: string,
  owner: string
): Promise<string> => {
  const userTileDBAPI = await getTileDBAPI(UserApi);
  const orgTileDBAPI = await getTileDBAPI(OrganizationApi);
  const isOwnerOrganization = user !== owner;
  /**
   * If the current owner is the user we use UserAPI to get user's data
   * otherwise the current owner is an organization so we use OrganizationApi
   * to get the org's data
   */
  const getOwnerData = (): Promise<any> =>
    isOwnerOrganization
      ? orgTileDBAPI.getOrganization(owner)
      : userTileDBAPI.getUser();
  const ownerResponse = await getOwnerData();
  return ownerResponse.data.default_s3_path_credentials_name;
};

export default getDefaultCredentialNameFromNamespace;
