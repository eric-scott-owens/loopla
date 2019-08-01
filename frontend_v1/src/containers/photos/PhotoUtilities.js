import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
import keys from 'lodash/keys';
import { base64EncodeFileAsync } from '../../utilities/FileUtilities';

function createEncodedPhotoCollectionIndex(photoCollections) {
  // setup promise for the entire job
  let resolver;
  const jobPromise = new Promise(resolve => { resolver = resolve });

  // Create index of encoded photo files indexed by collection 
  // ordering and collection photo ordering
  const encodedPhotos = {};

  // Fill the indices
  let promises = [];

  forEach(photoCollections, (photoCollection, collectionIndex) => {
    const actualPhotoCollectionPhotos = photoCollection.photoCollectionPhotos;
    encodedPhotos[collectionIndex] = {};

    const miniPromises = actualPhotoCollectionPhotos.map(async (photoWrapper, orderingIndex) => {
      const { photo } = photoWrapper;

      if(photo.file && photo.file.size > 0) {
        const encoded = await base64EncodeFileAsync(photo.file);
        encodedPhotos[collectionIndex][orderingIndex] = encoded;
      // } else {
      //   encodedPhotos[collectionIndex][orderingIndex] = photo;
      }
    });

    promises = concat(promises, miniPromises);
  });

  // When all photos are resolved, resolve our job's promise
  Promise.all(promises).then(() => resolver(encodedPhotos));
  
  return jobPromise;
}

/**
 * Prepares new photo collection photos for upload and returns
 * the prepared array of photo collections.
 * @param {*} photoCollections 
 */
export async function encodePhotoCollectionPhotos(photoCollections) {
  // Get the encoded photos indexed by photo collection ordering index
  // and photo collection photo ordering index
  const encodedPhotosIndex = await createEncodedPhotoCollectionIndex(photoCollections);

  // Copy the array so that we don't mutate
  const updatedPhotoCollections = photoCollections.slice(0);
  
  // For each photoCollection which had a photo encoded
  const photoCollectionIndexes = keys(encodedPhotosIndex);
  forEach(photoCollectionIndexes, collectionIndex => {
    // Create a new object for the photo collection and replace it in 
    // the updated collections array
    const updatedPhotoCollection = {...updatedPhotoCollections[collectionIndex]};
    updatedPhotoCollections[collectionIndex] = updatedPhotoCollection;

    // For each photo collection photo we had a photo encoded
    const photoCollectionPhotoIndexes = keys(encodedPhotosIndex[collectionIndex]);
    forEach(photoCollectionPhotoIndexes, photoIndex => {
      // Care a new object for the photoCollectionPhoto and replace it in
      // the updated photoCollection array of photoCollectionPhotos
      const updatedPhotoCollectionPhoto = {...updatedPhotoCollection.photoCollectionPhotos[photoIndex]};
      updatedPhotoCollection.photoCollectionPhotos[photoIndex] = updatedPhotoCollectionPhoto;
      
      // Create a new photo object and insert the encoded photo data into it
      const updatedPhoto = {...updatedPhotoCollectionPhoto.photo};
      updatedPhoto.imageUpload = encodedPhotosIndex[collectionIndex][photoIndex].base64EncodedData;

      // include the updated photo in the updated PhotoCollectionPhoto
      updatedPhotoCollectionPhoto.photo = updatedPhoto;
    });

  });

  return updatedPhotoCollections;
}

export function imprintPhotoCollectionOrderingIndexes(photoCollections) {
  const updatedPhotoCollections = photoCollections.slice(0);
  forEach(updatedPhotoCollections, (photoCollection, collectionIndex) => {
    const updatedPhotoCollection = {...photoCollection, orderingIndex: collectionIndex};
    updatedPhotoCollections[collectionIndex] = updatedPhotoCollection;

    const updatedPhotoCollectionPhotos = updatedPhotoCollection.photoCollectionPhotos.slice(0);
    updatedPhotoCollection.photoCollectionPhotos = updatedPhotoCollectionPhotos;

    forEach(updatedPhotoCollectionPhotos, (photoCollectionPhoto, photoIndex) => {
      const updatedPhotoCollectionPhoto = {...photoCollectionPhoto, orderingIndex: photoIndex};
      updatedPhotoCollectionPhotos[photoIndex] = updatedPhotoCollectionPhoto;
    });
  });

  return updatedPhotoCollections;
} 