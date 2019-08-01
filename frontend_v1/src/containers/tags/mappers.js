import { mapObject } from '../../utilities/ObjectUtilities';

// <summary>
// Converts tags retrieved from the server into full JS objects
// </summary>
export function fromServerTagObject(tag) {
  const convertedTag = mapObject.fromServerDatabaseObject(tag);
  convertedTag.name = (convertedTag.name || '').toLowerCase();
  return convertedTag;
}

export function fromClientTagObject(tag) {
  const convertedTag = mapObject.fromClientDatabaseObject(tag);
  return convertedTag;
}

export function fromDeserializedClientTagObject(tag) {
  const convertedTag = mapObject.fromDeserializedClientObject(tag);
  return convertedTag;
}