import configuration from '../../../../configuration';
import * as fetchActions from '../../../../actions/fetch';
import * as membershipActions from '../actions';
import { HttpMethods } from '../../../http';
import * as mappers from './mappers';
import * as membershipMappers from '../mappers';

// eslint-disable-next-line
export const updateUserEngagementSection = (userEngagementSectionUpdateRequest) => async dispatch => {
  try {
    const serverModel = mappers.fromClientUserEngagementSectionUpdateRequestObject(userEngagementSectionUpdateRequest);
    const json = JSON.stringify(serverModel);
    let updatedMembership = await dispatch(fetchActions.fetch(
      `${configuration.API_ROOT_URL}/loop/manage/update-user-engagement-section/`,
      {
        method: HttpMethods.POST,
        body: json,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    ));

    updatedMembership = membershipMappers.fromServerMembershipObject(updatedMembership);
    dispatch(membershipActions.setMembership(updatedMembership.id, updatedMembership));
  }
  catch(error) {
    // let the fetch resource reducers take car of error notifications
    console.log(error);
  }
}