import forEach from 'lodash/forEach';

export function getUserLoopMembership(state, userId, loopId) {
  let membership;

  // Don't need to care about a return other than the loop break...
  // eslint-disable-next-line
  forEach(state.memberships, (item) => {
    if(item.userId === userId && item.groupId === loopId) {
      membership = item;
      return false; // break the loop
    }
  });

  return membership;
}

export function isActiveMember(state, userId, loopId) {
  const membership = getUserLoopMembership(state, userId, loopId);
  return (membership && membership.isActive);
}

export function getLoopMemberships(storeState, loopId) {
  const { memberships } = storeState;
  const loopMemberships = [];
  forEach(memberships, membership => {
    if(membership.groupId === loopId) {
      loopMemberships.push(membership);
    }
  });

  return loopMemberships;
}

export function getLoopMembershipsHash(storeState, loopId) {
  const { memberships } = storeState;
  const loopMemberships = [];
  forEach(memberships, membership => {
    if(membership.groupId === loopId) {
      loopMemberships[membership.id] = membership;
    }
  });

  return loopMemberships;
}