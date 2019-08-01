import { mapObject } from '../../utilities/ObjectUtilities';


// <summary>
// Converts a place retrieved from the server into a full JS objects
// </summary>
export function fromServerPlaceObject(place) {
  const convertedPlace = mapObject.fromServerDatabaseObject(place);

  if(convertedPlace.isUserGenerated) {
    convertedPlace.googlePlaceId = null;
  }
  else {
    convertedPlace.googlePlaceId = place.name;
    convertedPlace.name = null;
  }

  return convertedPlace;
}

export function fromClientPlaceObject(place) {
  const convertedPlace = mapObject.fromClientDatabaseObject(place);

  if(convertedPlace.googlePlaceId) {
    convertedPlace.name = place.googlePlaceId;
    delete convertedPlace.googlePlaceId;
  }
  
  return convertedPlace;
}

export function fromDeserializedClientPlaceObject(place) {
  const convertedPlace = mapObject.fromDeserializedClientObject(place);
  return convertedPlace;
}