/* eslint-disable no-param-reassign */
import { createAction } from 'redux-actions';
import forEach from 'lodash/forEach';
import configuration from '../../../../configuration';
import * as fetchActions from '../../../../actions/fetch';
import { HttpMethods } from '../../../http';
import * as mappers from './mappers';

export const ACTION_TYPES = {
  addInviteeRow: 'ADD-LOOP-MEMBERSHIP-INVITEE-ROW'
}


export const addInviteeRowToForm = createAction(ACTION_TYPES.addInviteeRow);

export const addLoopMembers = (addLoopMembersRequest) => async dispatch => {
  try{

    const trimmedInvitees = addLoopMembersRequest.invitees.map(invitee => {
      const email = invitee.email.trim();
      const firstName = invitee.firstName.trim();
      const lastName = invitee.lastName.trim();

      const trimmedSingle = {
        email, 
        firstName, 
        lastName
      }

      return trimmedSingle;
    })

    const loopMembers = {};
    
    Object.assign(loopMembers, addLoopMembersRequest);

    loopMembers.invitees = trimmedInvitees;

    const serverModel = mappers.fromClientAddLoopMembersRequestObject(loopMembers);
    const json = JSON.stringify(serverModel);
    await dispatch(fetchActions.fetch(
      `${configuration.API_ROOT_URL}/loop/manage/add-loop-members/`,
      {
        method: HttpMethods.POST,
        body: json,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ));
  }
  catch(error) {
    // let the fetch resource reducers take care of error notifications
  }
};