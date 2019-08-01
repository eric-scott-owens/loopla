import MembershipTypeEnum from '../../../../../../containers/loops/memberships/MembershipTypeEnum';
import StatusChangeOptionsEnum from '../../../../../../containers/loops/memberships/changeMembershipStatus/StatusChangeOptionsEnum';

const statusChangeRadioOptions = [
  {
    value: StatusChangeOptionsEnum.ADMIN_TO_MEMBER,
    for: MembershipTypeEnum.Administrator,
    title: 'Remove as organizer',
    description: 'Will no longer be able to invite members or organizers, change member status, or edit loop settings.',
    isEmailRequired: false
  },
  {
    value: StatusChangeOptionsEnum.ADMIN_TO_INACTIVE,
    for: MembershipTypeEnum.Administrator,
    title: 'Make inactive',
    description: 'Will no longer be able to post and will not see new posts made after this change.',
    isEmailRequired: false
  },
  {
    value: StatusChangeOptionsEnum.REMOVE_ADMIN,
    for: MembershipTypeEnum.Administrator,
    title: 'Remove member',
    description: 'Will no longer be able to view this loop. User\'s posts will be permanently removed.',
    isEmailRequired: false
  },
  {
    value: StatusChangeOptionsEnum.MEMBER_TO_ADMIN,
    for: MembershipTypeEnum.Member,
    title: 'Invite as organizer',
    description: 'Once they accept, this member will be able to invite members and organizers, change member status, and edit loop settings.',
    isEmailRequired: true
  },
  {
    value: StatusChangeOptionsEnum.MEMBER_TO_INACTIVE,
    for: MembershipTypeEnum.Member,
    title: 'Make inactive',
    description: 'This member will no longer be able to post and will not see posts made after this status change.',
    isEmailRequired: false
  },
  {
    value: StatusChangeOptionsEnum.REMOVE_MEMBER,
    for: MembershipTypeEnum.Member,
    title: 'Remove member',
    description: 'This member\'s posts will be removed and they will no longer be able to view this loop.',
    isEmailRequired: false
  },
  {
    value: StatusChangeOptionsEnum.INACTIVE_TO_MEMBER,
    for: MembershipTypeEnum.Inactive,
    title: 'Reinstate membership',
    description: 'This member will once again be able to make posts and view this loop.',
    isEmailRequired: false
  },
  {
    value: StatusChangeOptionsEnum.REMOVE_INACTIVE,
    for: MembershipTypeEnum.Inactive,
    title: 'Remove member',
    description: 'This member\'s posts will be removed and they will no longer be able to view this loop.',
    isEmailRequired: false
  }
];

export default statusChangeRadioOptions;

export const getStatusChangeRadioOptionConfigByValue = (statusChangeOptionValue) => {
  const option = statusChangeRadioOptions.filter(o => o.value === statusChangeOptionValue);
  if(!option || option.length !== 1) { 
    throw new Error(`Invalid statusChangeOptionValue: ${statusChangeOptionValue}`);
  }

  return option[0];
}