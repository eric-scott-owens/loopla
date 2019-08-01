const MembershipTypeEnum = {
  Administrator: 'Admin',
  Member: 'Member',
  Inactive: 'Inactive'
};

export default MembershipTypeEnum;

export function getMembershipType(membership) {
  if(membership.isActive) {
    if(membership.isCoordinator) return MembershipTypeEnum.Administrator;
    return MembershipTypeEnum.Member;
  }
  return MembershipTypeEnum.Inactive;
}