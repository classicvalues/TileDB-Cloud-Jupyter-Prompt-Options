import { v1 } from '@tiledb-inc/tiledb-cloud';

export default function getOrgNamesWithWritePermissions(
  orgs: v1.OrganizationUser[]
): string[] {
  const orgNames: string[] = [];

  orgs.forEach((org) => {
    const orgName = org.organization_name;
    if (
      orgName !== 'public' &&
      !!~org.allowed_actions.indexOf('write' as v1.NamespaceActions.Write)
    ) {
      orgNames.push(orgName);
    }
  });

  return orgNames;
}
