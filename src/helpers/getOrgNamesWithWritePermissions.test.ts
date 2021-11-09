import getOrgNamesWithWritePermissions from './getOrgNamesWithWritePermissions';

describe('getOrgNamesWithWritePermissions', () => {
  it('should ', () => {
    const orgs: any = [
      {
        organization_name: 'public',
        allowed_actions: ['write', 'read']
      },
      {
        organization_name: 'demo',
        allowed_actions: ['read']
      },
      {
        organization_name: 'demo2',
        allowed_actions: ['write']
      },
      {
        organization_name: 'demo3',
        allowed_actions: ['write', 'read']
      }
    ];
    const whitelistedOrgs = getOrgNamesWithWritePermissions(orgs);

    expect(whitelistedOrgs).toEqual(['demo2', 'demo3']);
  });
});
