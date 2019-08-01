import configuration from '../../../../configuration';
import { mapObject } from '../../../../utilities/ObjectUtilities';

// I'm assuming more mappers will end up in here
// eslint-disable-next-line
export function fromClientUserEngagementSectionUpdateRequestObject(userEngagementSectionUpdateRequest) {
  const convertedRequest = mapObject.fromCamelCasedObject(userEngagementSectionUpdateRequest);
  delete convertedRequest.id;
  delete convertedRequest.model;
  delete convertedRequest[configuration.internalFieldNames.IS_EDITING];

  convertedRequest.group_id = parseInt(userEngagementSectionUpdateRequest.groupId, 10);
  convertedRequest.user_id = parseInt(userEngagementSectionUpdateRequest.userId, 10);

  return convertedRequest;
}