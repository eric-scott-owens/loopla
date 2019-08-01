import configuration from '../../../../configuration';
import * as fetchActions from '../../../../actions/fetch';
import * as membershipActions from '../actions';
import { HttpMethods } from '../../../http';
import * as mappers from './mappers';

// eslint-disable-next-line
export const changeMembershipStatus = (changeMembershipStatusRequest) => async dispatch => {
  try {
    const serverModel = mappers.fromClientChangeMembershipStatusRequestObject(changeMembershipStatusRequest);
    const json = JSON.stringify(serverModel);
    const updatedMembership = await dispatch(fetchActions.fetch(
      `${configuration.API_ROOT_URL}/loop/manage/change-membership-status/`,
      {
        method: HttpMethods.POST,
        body: json,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ));

    dispatch(membershipActions.setMembership(updatedMembership.id, updatedMembership));
  }
  catch(error) {
    // let the fetch resource reducers take car of error notifications
  }
}