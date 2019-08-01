import { mapObject } from '../../utilities/ObjectUtilities';

// <summary>
// Converts category retrieved from the server into full JS objects
// </summary>
export function fromServerCategoryObject(category) {
  const convertedCategory = mapObject.fromServerDatabaseObject(category);
  const camelCategory = mapObject.fromUnderScoredObject(convertedCategory);
  return camelCategory;
}


export function fromClientCategoryObject(category, state) {
  const convertedCategory = mapObject.fromClientDatabaseObject(category);
  const underscoredCategory = mapObject.fromCamelCasedObject(convertedCategory);

  return underscoredCategory;
}

export function fromDeserializedClientCategoryObject(category, state) {
  const convertedCategory = mapObject.fromDeserializedClientObject(category);
  return convertedCategory;
}
