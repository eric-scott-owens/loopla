import { createAction } from 'redux-actions';
import configuration from '../../../configuration';
import * as fetchResourceActions from '../../../actions/fetchResource';
import { fetch } from '../../../actions/fetch';
import { fromServerMembershipObject } from './mappers';

export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-MEMBERSHIPS',
    set: 'SET-MEMBERSHIPS'
  },
  single: {
    fetch: 'FETCH-MEMBERSHIP',
    set: 'SET-MEMBERSHIP'
  },
  create: 'CREATE-MEMBERSHIP',
  update: 'UPDATE-MEMBERSHIP',
  reset: 'RESET-MEMBERSHIPS'
}

export const setMembership = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});

export const resetMemberships = createAction(ACTION_TYPES.reset);

export const setMemberships = createAction(ACTION_TYPES.all.set);

export const fetchMembership = membershipId => async dispatch => {
  try{
    const membership = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.membership, membershipId));
    dispatch(setMembership(membershipId, membership));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchMemberships = () => async dispatch => {
  try {
    const memberships = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.membership, undefined, true));
    dispatch(setMemberships(memberships));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchMembershipsForUser = (userId) => async dispatch => {
  try {
    const memberships = await dispatch(fetch(`${configuration.API_ROOT_URL}/memberships/?user=${userId}`, { method: 'GET'}));
    const mappedMemberships = memberships.map(m => fromServerMembershipObject(m));
    dispatch(setMemberships(mappedMemberships));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchMembershipsForLoop = (loopId) => async dispatch => {
  try {
    const memberships = await dispatch(fetch(`${configuration.API_ROOT_URL}/memberships/?loop=${loopId}`, { method: 'GET'}));
    const mappedMemberships = memberships.map(m => fromServerMembershipObject(m));
    dispatch(setMemberships(mappedMemberships));
  } catch(error) {
    // let the fetch resource reducers take care of error notifications
  }
}