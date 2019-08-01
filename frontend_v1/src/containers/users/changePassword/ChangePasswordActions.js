import { HttpMethods, StandardHeaders } from '../../http';
import { fetch } from '../../../actions/fetch';
import configuration from '../../../configuration';
import mapper from './ChangePasswordFormMapper';

// eslint-disable-next-line
export const changePassword = (formData) => async(dispatch) => {
  const serverModel = mapper(formData);
  const json = JSON.stringify(serverModel);
  
  return dispatch(
      fetch(
        `${configuration.API_ROOT_URL}/user/change-password/`,
        {
          method: HttpMethods.POST,
          body: json,
          headers: StandardHeaders.AJAX
        }));
}