import { createAction } from 'redux-actions';
import configuration from '../../../configuration';
import * as fetchResourceActions from '../../../actions/fetchResource';
import { fetch } from '../../../actions/fetch'; 
import { HttpMethods } from '../../http';

export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-MULTI-USE-INVITATIONS',
    set: 'SET-MULTI-USE-INVITATIONS'
  },
  single: {
    fetch: 'FETCH-MULTI-USE-INVITATION',
    set: 'SET-MULTI-USE-INVITATION'
  },
  setPage: 'SET-MULTI-USE-INVITATION-PAGE',
  remove: 'REMOVE-MULTI-USE-INVITATION'
}

export const removeMultiUseInvitationPage = createAction(ACTION_TYPES.remove);

export const setMultiUseInvitation = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});

export const setMultiUseInvitationPage = (payload) => ({
  type: ACTION_TYPES.setPage,
  payload
});


export const setMultiUseInvitations = createAction(ACTION_TYPES.all.set);

export const fetchMultiUseInvitation = invitationId => async dispatch => {
  try {
    const invitation = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.multiUseInvitation, invitationId));
    dispatch(setMultiUseInvitation(invitationId, invitation));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}
export const disableMultiUseInvitation = (invitationKey) => async dispatch => {
  try{
    const json = JSON.stringify(invitationKey);
    const invitation = await dispatch(fetch(`${configuration.API_ROOT_URL}/multi-use-invitation-page/update-visibility/?key=${invitationKey}`, 
    {
      method: HttpMethods.POST,
      body: json,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    ));
    dispatch(setMultiUseInvitationPage(invitation));
    console.log(invitation);
  }
  catch(error) {
    // Delete errors 
  }
}
export const fetchMultiUseInvitations = () => async dispatch => {
  try {
    const invitations = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.multiUseInvitation));
    dispatch(setMultiUseInvitations(invitations));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchMultiUseInvitationByKey = invitationKey => async dispatch => {
  try {
    const invitation = await dispatch(fetch(`${configuration.API_ROOT_URL}/multi-use-invitation-page/?key=${invitationKey}`, { method: 'GET'}));
    dispatch(setMultiUseInvitationPage(invitation));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchMultiUseInvitationByGroupId = groupId => async dispatch => {
  try {
    const invitation = await dispatch(fetch(`${configuration.API_ROOT_URL}/multi-use-invitation-page/get-by-group/?group_id=${groupId}`, { method: 'GET'}));
    dispatch(setMultiUseInvitationPage(invitation));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const editInvitationKey = invitationKey => async dispatch => {
  try {
    const invitation = await dispatch(fetch(`${configuration.API_ROOT_URL}/multi-use-invitation-page/edit-invitation-key/?key=${invitationKey}`, { method: 'POST'}));
    dispatch(setMultiUseInvitationPage(invitation));
  }
  catch(error) {
    // Error handling for generating new key
  }
}

export const acceptMultiUseInvitation = invitationKey => async dispatch => {
  try {
    const json = JSON.stringify(invitationKey);
    await dispatch(fetch(
      `${configuration.API_ROOT_URL}/multi-use-invitation-page/accept/`,
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