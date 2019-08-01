import configuration from '../../configuration';
import { mapObject } from '../../utilities/ObjectUtilities';
import { HttpMethods } from '../http';


// eslint-disable-next-line
export const addToWaitlist = (user) => async dispatch => {

  try {
    const convertedUser = mapObject.fromCamelCasedObject(user);

    const myContactInfo = {
      email: convertedUser.email,
      first_name: convertedUser.first_name, 
      last_name: convertedUser.last_name
    }

    const json = JSON.stringify({ 
      model_type: convertedUser.model, 
      model_id: convertedUser.id,
      contact_info: myContactInfo,
      general_comments: convertedUser.comment
     });
    await dispatch(
      fetch(
        `${configuration.API_ROOT_URL}/waitlist/`,
        {
          method: HttpMethods.POST,
          body: json,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
    );

  } catch(error) {
    // TODO: error handling here
  }
}