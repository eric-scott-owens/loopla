import { mapObject } from '../../../utilities/ObjectUtilities';


export function fromServerSummaryPreferenceObject(preferences) {
  const convertedPreference = mapObject.fromServerDatabaseObject(preferences);
  return Object.assign({}, convertedPreference);
};


export function fromClientSummaryPreferenceObject(pref) {
  const convertedPreference = mapObject.fromClientDatabaseObject(pref);
  const underscoredPreference = mapObject.fromCamelCasedObject(convertedPreference);
  return underscoredPreference;
}

export function fromDeserializedClientSummaryPreferenceObject(summaryPreference) {
  const convertedSummaryPreference = mapObject.fromDeserializedClientObject(summaryPreference);
  return convertedSummaryPreference;
}