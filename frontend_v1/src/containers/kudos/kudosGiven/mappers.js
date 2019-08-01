import { mapObject } from '../../../utilities/ObjectUtilities';

// Ignore default export rule in library files
// eslint-disable-next-line
export function fromServerKudosGivenObject(kudosGiven) {
  const mappedKudosGiven = mapObject.fromServerDatabaseObject(kudosGiven);
  return mappedKudosGiven;
}
