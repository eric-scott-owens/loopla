import configuration from '../../../../configuration';
import { mapObject } from '../../../../utilities/ObjectUtilities';

// I'm assuming more mappers will end up in here
// eslint-disable-next-line
export function fromClientChangeMembershipStatusRequestObject(changeMembershipStatusRequest) {
  const convertedRequest = mapObject.fromCamelCasedObject(changeMembershipStatusRequest);
  delete convertedRequest.id;
  delete convertedRequest.model;
  delete convertedRequest[configuration.internalFieldNames.IS_EDITING];

  convertedRequest.loop_id = changeMembershipStatusRequest.loopId;
  convertedRequest.user_id = changeMembershipStatusRequest.userId;

  return convertedRequest;
}