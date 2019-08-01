import { mapObject } from '../../../utilities/ObjectUtilities';

// eslint-disable-next-line import/prefer-default-export
export function fromServerKudosAvailableObject(kudo) {
  const convertedKudo = mapObject.fromServerDatabaseObject(kudo);
  return convertedKudo;
}