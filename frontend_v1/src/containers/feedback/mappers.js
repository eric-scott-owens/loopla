import { mapObject } from '../../utilities/ObjectUtilities';

// I'm assuming more mappers with end up in here
// eslint-disable-next-line
export function fromClientFeedbackObject(feedback, state) {
  const serverFeedback = mapObject.fromClientDatabaseObject(feedback);
  const convertedFeedback = mapObject.fromCamelCasedObject(serverFeedback);

  return convertedFeedback;
} 
