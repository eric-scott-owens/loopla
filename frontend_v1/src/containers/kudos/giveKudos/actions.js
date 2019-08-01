import { fetch } from '../../../actions/fetch';
import configuration from '../../../configuration';
import { HttpMethods, StandardHeaders } from '../../http';
import { kudosGivenEventReceived } from '../kudosGiven/actions';

// eslint-disable-next-line import/prefer-default-export
export const giveKudos = (contentType, objectId, selectedKudoId, kudosNote) => async dispatch => {
  try {
    const json = JSON.stringify({
      content_type: contentType,
      object_id: objectId,
      kudos_id: selectedKudoId,
      note: kudosNote
    })
  
    const params = {
        method: HttpMethods.POST,
        body: json,
        headers: StandardHeaders.AJAX
    };
    
    const result = await dispatch(fetch(`${configuration.API_ROOT_URL}/give-kudos/`, params));
    dispatch(kudosGivenEventReceived(result));
    return result;

  } catch(error) {
      throw error;
  }
}