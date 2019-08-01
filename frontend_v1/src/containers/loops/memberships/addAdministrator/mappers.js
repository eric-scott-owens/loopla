import configuration from '../../../../configuration';
import { mapObject } from '../../../../utilities/ObjectUtilities';

// I'm assuming more mappers will end up in here
// eslint-disable-next-line
export function fromClientAddLoopAdministratorRequestObject(addLoopAdministratorRequest) {
  const convertedRequest = mapObject.fromCamelCasedObject(addLoopAdministratorRequest);
  convertedRequest.loop_id = addLoopAdministratorRequest.loopId;

  delete convertedRequest.id;
  delete convertedRequest.model;
  delete convertedRequest[configuration.internalFieldNames.IS_EDITING];

  return convertedRequest;
};