import configuration from '../../../../configuration';
import * as fetchActions from '../../../../actions/fetch';
import { HttpMethods } from '../../../http';
import * as mappers from './mappers';

// I'm assuming more mappers will end up in here
// eslint-disable-next-line
export const addLoopAdministrator = (addLoopAdministratorRequest) => async dispatch => {
  try{
    const serverModel = mappers.fromClientAddLoopAdministratorRequestObject(addLoopAdministratorRequest);
    const json = JSON.stringify(serverModel);
    await dispatch(fetchActions.fetch(
      `${configuration.API_ROOT_URL}/loop/manage/add-loop-administrator/`,
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