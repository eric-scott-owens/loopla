import forEach from 'lodash/forEach';

export function getLoopMultiUseInvitations(storeState, loopId) {
  const { multiUseInvitations } = storeState;
  const loopMultiUseInvitations = [];
  forEach(multiUseInvitations, invitation => {
    if(invitation.groupId === loopId) {
      loopMultiUseInvitations.push(invitation);
    }
  });

  return loopMultiUseInvitations;
};

export function getLoopMultiUseInvitationsHash(storeState, loopId) {
  const { multiUseInvitations } = storeState;
  const loopMultiUseInvitations = {};
  forEach(multiUseInvitations, invitation => {
    if(invitation.groupId === loopId) {
      loopMultiUseInvitations[invitation.id] = invitation;
    }
  });

  return loopMultiUseInvitations;
};