import { createAction } from 'redux-actions';

import configuration from '../../configuration';
import { fetch } from '../../actions/fetch';
import * as fetchResourceActions from '../../actions/fetchResource';
import { encodePhotoCollectionPhotos, imprintPhotoCollectionOrderingIndexes } from '../photos/PhotoUtilities';


export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-COMMENTS',
    set: 'SET-COMMENTS'
  },
  single: {
    fetch: 'FETCH-COMMENT',
    set: 'SET-COMMENT'
  },
  
  create: 'CREATE-COMMENT',
  update: 'UPDATE-COMMENT',

  addCommentToPost: 'ADD-COMMENT-TO-POST',
  deleteCommentFromPost: 'DELETE-COMMENT-FROM-POST',

  setCommentCountForUser: 'SET-COMMENT-COUNT-FOR-USER',
}

export const setComment = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload,
});

export const setComments = createAction(ACTION_TYPES.all.set);

export const setCommentCountForUser = (id, payload) => ({
  type: ACTION_TYPES.setCommentCountForUser,
  id,
  payload,
});

export const fetchComment = commentId => async dispatch => {
  try{
    const comment = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.comment, commentId));
    dispatch(setComment(commentId, comment));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

/**
 * Action to add a comment to a specific post
 * @param {integer} postId - ID of the post to add the comment to
 * @param {commentId} commentId
 */
export const addCommentToPost = (postId, commentId) => ({
  type: ACTION_TYPES.addCommentToPost,
  postId,
  commentId
});

export const deleteCommentFromPost = (postId, commentId) => ({
  type: ACTION_TYPES.deleteCommentFromPost,
  postId,
  commentId
});

export const createComment = (comment) => async dispatch => {
  try {
    const encodedPhotoCollections = await encodePhotoCollectionPhotos(comment.photoCollections);
    const processedPhotoCollections = imprintPhotoCollectionOrderingIndexes(encodedPhotoCollections);
    const processedComment = { ...comment, photoCollections: processedPhotoCollections };

    const postedComment = await dispatch(fetchResourceActions.post(configuration.MODEL_TYPES.comment, processedComment));
    dispatch(setComment(postedComment.id, postedComment));
    dispatch(addCommentToPost(comment.postId, postedComment.id));
  } catch(error) {
    // TODO: error handling here
  }
}

export const updateComment = comment => async dispatch => {
  try {
    const encodedPhotoCollections = await encodePhotoCollectionPhotos(comment.photoCollections);
    const processedPhotoCollections = imprintPhotoCollectionOrderingIndexes(encodedPhotoCollections);
    const processedComment = { ...comment, photoCollections: processedPhotoCollections };
    
    const postedComment = await dispatch(fetchResourceActions.patch(configuration.MODEL_TYPES.comment, processedComment));
    dispatch(setComment(postedComment.id, postedComment));
  } catch(error) {
    // TODO: error handling here
  }
}

export const deleteComment = (comment) => async dispatch => {
  try {
    await dispatch(fetchResourceActions.deleteResource(configuration.MODEL_TYPES.comment, comment.id));
    dispatch(deleteCommentFromPost(comment.postId, comment.id));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  } 
}

export const fetchCommentCountForUser = userId => async dispatch => {
  try{
    const numPosts = await dispatch(fetch(`${configuration.API_ROOT_URL}/comment-count/?userId=${userId}`, {method: 'GET'}));
    dispatch(setCommentCountForUser(userId, numPosts));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}