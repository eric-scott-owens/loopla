import configuration from '../../configuration';
import { fetch } from '../../actions/fetch';
import { HttpMethods, StandardHeaders } from '../http';
import { mapObject } from '../../utilities/ObjectUtilities';

export const logSimpleAction = (actionType) => async(dispatch) => {
  const data = mapObject.fromCamelCasedObject({ actionType });
  const json = JSON.stringify(data);

  dispatch(
    fetch(
      `${configuration.TELEMETRY_ROOT_URL}/log-simple-action`,
      { 
        method: HttpMethods.POST, 
        body: json,
        headers: StandardHeaders.AJAX
      }
    ));
}

// eslint-disable-next-line
export const logNavigationAction = (navigationContext) => async(dispatch) => {
  const data = mapObject.fromCamelCasedObject(navigationContext);
  const json = JSON.stringify(data);

  dispatch(
    fetch(
      `${configuration.TELEMETRY_ROOT_URL}/log-navigation-action`,
      {
        method: HttpMethods.POST,
        body: json,
        headers: StandardHeaders.AJAX
      }
    )
  )
}