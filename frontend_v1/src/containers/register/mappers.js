import configuration from '../../configuration';
import { mapObject } from '../../utilities/ObjectUtilities';

// I'm assuming more mappers with end up in here
// eslint-disable-next-line
export function fromClientRegistrationRequestObject(registrationRequest) {
  const convertedRequest = mapObject.fromCamelCasedObject(registrationRequest);
  delete convertedRequest.id;
  delete convertedRequest.model;
  delete convertedRequest[configuration.internalFieldNames.IS_EDITING];
  return convertedRequest;
}