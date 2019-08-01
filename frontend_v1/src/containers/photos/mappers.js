import { mapObject } from '../../utilities/ObjectUtilities';

// <summary>
// Converts a photo retrieved from the server into a full JS objects
// </summary>
export function fromServerPhotoObject(photo) {
  const convertedPhoto = mapObject.fromServerDatabaseObject(photo);
  
  convertedPhoto.url = photo.photo;
  delete convertedPhoto.photo;

  return convertedPhoto;
}

export function fromClientPhotoObject(photo) {
  throw new Error('Not Yet Implemented')
}

export function fromDeserializedClientPhotoObject(photo) {
  const convertedPhoto = mapObject.fromDeserializedClientObject(photo);
  return convertedPhoto;
}
