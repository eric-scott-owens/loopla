import configuration from '../../../configuration';
import { mapObject } from '../../../utilities/ObjectUtilities';

export function fromServerGooglePlaceObject(place) {
  const filteredGooglePlace = { 
    id: place.place_id,
    model: configuration.MODEL_TYPES.googlePlace
  };

  // include only the fields our app cares about
  configuration.google.PLACE_FIELDS.forEach(fieldName => {
    filteredGooglePlace[fieldName] = place[fieldName];
  })

  const camelCasedGooglePlace = mapObject.fromUnderScoredObject(filteredGooglePlace);
  const convertedGooglePlace = mapObject.fromServerDatabaseObject(camelCasedGooglePlace);
  convertedGooglePlace.model = configuration.MODEL_TYPES.googlePlace;

  if(place.geometry && place.geometry.location) {
    const latLng = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }

    convertedGooglePlace.geometry.location = latLng;
  }

  return convertedGooglePlace;
}

export function fromClientGooglePlaceObject(place) {
  throw new Error('not yet implemented');
}

export function fromDeserializedClientGooglePlaceObject(googlePlace) {
  const convertedGooglePlace = mapObject.fromDeserializedClientObject(googlePlace);
  return convertedGooglePlace;
}