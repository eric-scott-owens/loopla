import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import { handleActions } from 'redux-actions';

import * as actions from './actions';

export function process(state, membership) {
  const memberships = {...state};
  memberships[membership.id] = membership;
  
  return memberships;
}

export const membershipReducers = handleActions({
  [actions.ACTION_TYPES.single.set]: (state, action) => {
    const newState = process(state, action.payload);
    return newState;
  },
  [actions.ACTION_TYPES.all.set]: (state, action) => {
    let updatedState = state;
    forEach(action.payload, user => {
      updatedState = process(updatedState, user);
    });
    
    return updatedState;
  },
  [actions.ACTION_TYPES.reset]: (state, action) => ({}),
}, 
// Initial State
{});


export function isCurrentUserMemberOf(state, loopId) {
  const { currentUserId } = state;
  const { memberships } = state;
  
  let isMember = false;
  const membershipKeys = keys(memberships);
  forEach(membershipKeys, mKey => {
    const membership = memberships[mKey];
    if(membership.userId === currentUserId && membership.groupId === loopId) {
      isMember = true;
      return false; // break loop
    }

    return true; // continue loop
  });

  return isMember;
}


export function isCurrentUserCoordinatorOf(state, loopId) {
  const { currentUserId } = state;
  const { memberships } = state;
  
  let isCoordinator = false;
  const membershipKeys = keys(memberships);
  forEach(membershipKeys, mKey => {
    const membership = memberships[mKey];
    if(
      membership.userId === currentUserId 
      && membership.groupId === loopId
      && membership.isCoordinator
    ) {
      isCoordinator = true;
      return false; // break loop
    }

    return true; // continue loop
  });

  return isCoordinator;
}


export function isCurrentUserMemberOfOneOf(state, loopIds) {
  const { currentUserId } = state;
  const { memberships } = state;
  
  let isMember = false;
  const membershipKeys = keys(memberships);
  forEach(loopIds, loopId => {
    
    forEach(membershipKeys, mKey => {
      const membership = memberships[mKey];
      if(membership.userId === currentUserId && membership.groupId === loopId) {
        isMember = true;
      }
  
      return !isMember; // break the loop is isMember is true - no need to keep looking
    });

    return !isMember; // break the loop is isMember is true - no need to keep looking

  });

  return isMember;
}