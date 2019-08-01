import { createAction } from 'redux-actions';
import configuration from '../../../configuration';
import * as fetchResourceActions from '../../../actions/fetchResource';
import { fetch } from '../../../actions/fetch'; 
import { HttpMethods } from '../../http';
import { fromServerInvitationObject } from './mappers';

export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-INVITATIONS',
    set: 'SET-INVITATIONS'
  },
  single: {
    fetch: 'FETCH-INVITATION',
    set: 'SET-INVITATION'
  },
  setPage: 'SET-INVITATION-PAGE',
  remove: 'REMOVE-INVITATION'
}

export const removeInvitationPage = createAction(ACTION_TYPES.remove);

export const setInvitation = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});

export const setInvitationPage = (payload) => ({
  type: ACTION_TYPES.setPage,
  payload
});


export const setInvitations = createAction(ACTION_TYPES.all.set);

export const fetchInvitation = invitationId => async dispatch => {
  try {
    const invitation = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.invitation, invitationId));
    dispatch(setInvitation(invitationId, invitation));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchInvitations = () => async dispatch => {
  try {
    const invitations = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.invitation));
    dispatch(setInvitations(invitations));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchInvitationsForLoop = (loopId) => async dispatch => {
  try {
    const invitations = await dispatch(fetch(`${configuration.API_ROOT_URL}/invitations/?loop=${loopId}`, { method: 'GET'}));
    const mappedInvitations = invitations.map(i => fromServerInvitationObject(i));
    dispatch(setInvitations(mappedInvitations));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchInvitationByKey = invitationKey => async dispatch => {
  try {
    const invitationPage = await dispatch(fetch(`${configuration.API_ROOT_URL}/invitation-page/?key=${invitationKey}`, { method: 'GET'}));
    dispatch(setInvitationPage(invitationPage));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const acceptInvitation = invitation => async dispatch => {
  try {
    const json = JSON.stringify(invitation.invitationKey);
    await dispatch(fetch(
      `${configuration.API_ROOT_URL}/invitation-page/accept`,
      {
        method: HttpMethods.POST,
        body: json,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}