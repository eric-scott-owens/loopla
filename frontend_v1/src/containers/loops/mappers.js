import configuration from '../../configuration';
import { mapObject } from '../../utilities/ObjectUtilities';


export function fromServerGroupObject(group) {
  const convertedGroup = mapObject.fromServerDatabaseObject(group);
  convertedGroup[configuration.internalFieldNames.SAFE_GROUP_NAME] = group.name;
  convertedGroup.name = convertedGroup.circle.name;
  return Object.assign({}, convertedGroup);
};


export function fromClientGroupObject(group) {
  const convertedGroup = mapObject.fromClientDatabaseObject(group);
  const underscoredGroup = mapObject.fromCamelCasedObject(convertedGroup);
  return underscoredGroup;
};

export function fromDeserializedClientGroupObject(group) {
  const convertedGroup = mapObject.fromDeserializedClientObject(group);
  return convertedGroup;
}