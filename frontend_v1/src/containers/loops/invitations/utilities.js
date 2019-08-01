import forEach from 'lodash/forEach';

export function getLoopInvitations(storeState, loopId) {
  const { invitations } = storeState;
  const loopInvitations = [];
  forEach(invitations, invitation => {
    if(invitation.groupId === loopId) {
      loopInvitations.push(invitation);
    }
  });

  return loopInvitations;
};

export function getLoopInvitationsHash(storeState, loopId) {
  const { invitations } = storeState;
  const loopInvitations = {};
  forEach(invitations, invitation => {
    if(invitation.groupId === loopId) {
      loopInvitations[invitation.id] = invitation;
    }
  });

  return loopInvitations;
};