import { createAction } from 'redux-actions';
import configuration from '../../configuration';
import * as fetchResourceActions from '../../actions/fetchResource';

export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-PHOTOS',
    set: 'SET-PHOTOS'
  },
  single: {
    fetch: 'FETCH-PHOTO',
    set: 'SET-PHOTO'
  },
  reset: 'RESET-PHOTOS'
}

export const resetPhotos = createAction(ACTION_TYPES.reset);

export const setPhoto = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload,
});

export const setPhotos = createAction(ACTION_TYPES.all.set);

export const fetchPhoto = photoId => async dispatch => {
  try{
    const photo = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.photo, photoId));
    dispatch(setPhoto(photoId, photo));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchPhotos = () => async dispatch => {
  try {
    const photos = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.photo));
    dispatch(setPhotos(photos));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}