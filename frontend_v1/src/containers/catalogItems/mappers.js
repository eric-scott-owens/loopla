import { mapObject } from '../../utilities/ObjectUtilities';

// eslint-disable-next-line import/prefer-default-export
export function fromServerCatalogItemObject(catalogItem) {
  const convertedItem = mapObject.fromServerDatabaseObject(catalogItem);
  return convertedItem;
}