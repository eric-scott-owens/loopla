import { createAction } from 'redux-actions';
import moment from 'moment';
import { fetch } from '../../actions/fetch';
import * as fetchResourceActions from '../../actions/fetchResource';
import * as authActions from '../auth/actions';
import configuration from '../../configuration';
import { base64EncodeFileAsync } from '../../utilities/FileUtilities';
import { isNullOrWhitespace } from '../../utilities/StringUtilities';
import { HttpMethods, StandardHeaders } from '../http';
import UserState from './UserState';
import { fromServerPostReferenceObject } from '../posts/mappers';
import { fromServerUserObject } from './mappers';

export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-USERS',
    set: 'SET-USERS'
  },
  single: {
    fetch: 'FETCH-USER',
    set: 'SET-USER'
  },
  currentUser: {
    fetch: 'FETCH-CURRENT-USER',
    set: 'SET-CURRENT-USER',
    reset: 'RESET-CURRENT-USER'
  }, 

  setKudosForUser: 'SET-KUDOS-FOR-USER',
  setGroupUserReferences: 'SET-GROUP-USER-REFERENCES',
  reset: 'RESET-USERS', 
  mergeData: 'USER-PAGE-MERGE', 
  addPostDataToUserData: 'USER-PAGE-ADD-POST-DATA',
  removePostsFromUserReferences: 'USER-PAGE-REMOVE-POST-REFERENCE'

}

export const setUser = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload,
});

export const removePostsFromUserReferences = (userId) => ({
  type: ACTION_TYPES.removePostsFromUserReferences,
  payload: userId
});

export const setKudosForUser = (id, payload) => ({
  type: ACTION_TYPES.setKudosForUser,
  id,
  payload,
});

export const mergeUserState = (userId, userState) => ({
  type: ACTION_TYPES.mergeData,
  userId,
  userState
});

export const addPostToUserData = (clientPostObject) => ({
  type: ACTION_TYPES.addPostDataToUserData,
  payload: clientPostObject
});


export const setGroupUserReferences = (id, payload) => ({
  type: ACTION_TYPES.setGroupUserReferences,
  id,
  payload
});


export const setUsers = createAction(ACTION_TYPES.all.set);

export const resetUsers = createAction(ACTION_TYPES.reset);

export const fetchUser = userId => async dispatch => {
  try{
    const user = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.user, userId));
    dispatch(setUser(userId, user));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchUsers = () => async dispatch => {
  try {
    const users = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.user));
    dispatch(setUsers(users));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const batchFetchUsers = (ids) => async dispatch => {
  try {  
    if(ids.length > 0) {
      const results = await dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.user, ids));
      if(results.loaded.length > 0) {
        dispatch(setUsers(results.loaded));
      }

      // for now we don't have anything to do with the cached users :)
    }
  }
  catch (error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const setCurrentUser = createAction(ACTION_TYPES.currentUser.set);

export const resetCurrentUser = createAction(ACTION_TYPES.currentUser.reset);

export const getCurrentUser = () => async (dispatch) => {
  try {
      const currentUser = await dispatch(fetch(`${configuration.API_ROOT_URL}/current-user/`, { method: HttpMethods.GET }));
      const mappedCurrentUser = fromServerUserObject(currentUser);
      dispatch(setCurrentUser(mappedCurrentUser));
      return mappedCurrentUser;
  }
  catch(error) {
    // Let the fetch reducers take care of error notifications
    if(error.status === 401) {
      dispatch(authActions.logout());
    }

    throw error;
  }
};

export const fetchKudosForUser = userId => async dispatch => {
  try{
    const kudos = await dispatch(fetch(`${configuration.API_ROOT_URL}/user-kudos-count/?user=${userId}`, { method: HttpMethods.GET }));
    dispatch(setKudosForUser(userId, kudos));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const getGroupUsersReferencesFor = groupId => async dispatch => {
  try {
    const groupUserReferences = await dispatch(fetch(`${configuration.API_ROOT_URL}/loop/${groupId}/users/`, {method: 'GET'}));
    dispatch(setGroupUserReferences(groupId, groupUserReferences));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const getAllUsersInGroup = groupId => async dispatch => {
  try {
    const users = await dispatch(fetch(`${configuration.API_ROOT_URL}/users/?group=${groupId}`, { method: HttpMethods.GET }));
    const mappedUsers = users.map(u => fromServerUserObject(u));
    dispatch(setUsers(mappedUsers));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const updateUser = user => async dispatch => {
  try {    
    if(user.photo && user.photo.preview && user.photo.size > 0) {
      const processedPhoto = await base64EncodeFileAsync(user.photo);
      const processedUser = { ...user, photo: processedPhoto };
      const updatedUser = await dispatch(fetchResourceActions.patch(configuration.MODEL_TYPES.user, processedUser));
      dispatch(setUser(updatedUser.id, updatedUser));
    }
    else {
      const updatedUser = await dispatch(fetchResourceActions.patch(configuration.MODEL_TYPES.user, user));
      dispatch(setUser(updatedUser.id, updatedUser));
    }

  } catch(error) {
    // TODO: error handling here
  }
}

export const getPostsReferencesOlderThanForUser = (olderThan, userId, groupId, targetBatchSize) => async (dispatch) => {
    try {
        const json = JSON.stringify({
            older_than: olderThan ? moment(olderThan).format('YYYY-MM-DDTHH:mm:ss.SSSSSS') : undefined,
            user_id: userId ,
            group_id: groupId,
            target_batch_size: targetBatchSize
        })
        
        const params = {
            method: HttpMethods.POST,
            body: json,
            headers: StandardHeaders.AJAX
        };

        const result = await dispatch(fetch(`${configuration.API_ROOT_URL}/post/older-than/`, params));

        // Create dashboard state from result data
        const userState = new UserState(userId);
        userState.displayedPostsEndDate = result.endDate ? moment(result.endDate).toDate() : undefined;
        userState.postsOlderThanDisplayedPostsEndDataExist = (result.postsOlderThanEndDateExist === true);
        userState.displayedPostReferences = result.posts.map(pr => fromServerPostReferenceObject(pr));

        // Merge the new dashboard state data
        dispatch(mergeUserState(userId, userState));

        // Merge the new dashboard state data
    } catch(error) {
      // do something here
    }
}

export const addPostToUsersLoadedData = (clientPostObject) => (dispatch) => {
  dispatch(addPostToUserData(clientPostObject));
};
export const searchUsers = query => async dispatch => {

  if(isNullOrWhitespace(query) || query.length < 3) { return [] };

  try {
    const params = {
      method: HttpMethods.POST,
      headers: StandardHeaders.AJAX,
      body: JSON.stringify({ query })
    };

    const userDisplayReferences = await dispatch(fetch(`${configuration.API_ROOT_URL}/search/users/`, params));
    return userDisplayReferences;
  }
  catch(error) {
    throw error;
  }
}
