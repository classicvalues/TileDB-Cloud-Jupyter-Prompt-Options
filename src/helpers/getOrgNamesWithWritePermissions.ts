import { OrganizationUser } from "@tiledb-inc/tiledb-cloud";

export default function getOrgNamesWithWritePermissions(orgs: OrganizationUser[]): string[] {
    const orgNames: string[] = [];
  
    orgs.forEach((org) => {
      const orgName = (org as any).organization_name;
      if (
        orgName !== "public" &&
        !!~(org as any).allowed_actions.indexOf("write" as any)
      ) {
        orgNames.push(orgName);
      }
    });
  
    return orgNames;
  }