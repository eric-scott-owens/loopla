import configuration from '../../../../configuration';
import { mapObject } from '../../../../utilities/ObjectUtilities';

// I'm assuming more mappers will end up in here
// eslint-disable-next-line
export function fromClientAddLoopMembersRequestObject(addLoopMembersRequest) {
  const convertedRequest = mapObject.fromCamelCasedObject(addLoopMembersRequest);
  convertedRequest.loop_id = addLoopMembersRequest.loopId;

  delete convertedRequest.id;
  delete convertedRequest.model;
  delete convertedRequest[configuration.internalFieldNames.IS_EDITING];

  return convertedRequest;
};