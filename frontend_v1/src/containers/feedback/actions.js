import { encodePhotoCollectionPhotos, imprintPhotoCollectionOrderingIndexes } from '../photos/PhotoUtilities';
import * as fetchResourceActions from '../../actions/fetchResource';
import configuration from '../../configuration';


export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-POSTS',
    set: 'SET-POSTS'
  },
  single: {
    fetch: 'FETCH-POST',
    set: 'SET-POST'
  },
  batch: {
    fetch: 'BATCH-FETCH-POSTS',
    set: 'BATCH-SET-POST-DATA'
  },

  create: 'CREATE-POST',
  update: 'UPDATE-POST',
  setPostCountForUser: 'SET-POST-COUNT-FOR-USER',
  setPostCountForGroup: 'SET-POST-COUNT-FOR-GROUP'
};


export const submitFeedback = (feedback) => async dispatch => {
  try {

    const encodedPhotoCollections = await encodePhotoCollectionPhotos(feedback.photoCollections);
    const processedPhotoCollections = imprintPhotoCollectionOrderingIndexes(encodedPhotoCollections);

    // Now create a new post with the processed photoData
    const processedFeedback = { ...feedback, photoCollections: processedPhotoCollections, ownerId: feedback.ownerId };
    // processedFeedback = fromClientFeedbackObject(processedFeedback);
    await dispatch(fetchResourceActions.post(configuration.MODEL_TYPES.feedback, processedFeedback));
    
  } catch(error) {
    // TODO: error handling here
  }
}
