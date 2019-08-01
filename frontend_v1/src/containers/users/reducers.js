import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import moment from 'moment';

import configuration from '../../configuration';
import values from 'lodash/values';
import * as actions from './actions';
import UserState from './UserState';

import { isCurrentUserMemberOfOneOf } from '../loops/memberships/reducers';

/**
 * Returns a new array containing only the newest, unique post references
 * @param {postReference[]} postReferences - the post references to deduplicate
 */
function uniquifyAndSortPostsReferences(postReferences) {
  const index = {};
  forEach(postReferences, postReference => {
      if(!index[postReference.id]) {
          index[postReference.id] = postReference;
      } else if(index[postReference.id].newestUpdate.getTime() < postReference.newestUpdate.getTime()) {
          index[postReference.id] = postReference;
      }
  });

  const newestUniquePostReferences = values(index);
  newestUniquePostReferences.sort((a, b) => b.newestUpdate -  a.newestUpdate);

  return newestUniquePostReferences;
}

export function process(state, user) {
  const users = {...state};
  users[user.id] = user;
  
  return users;
}

export const userReducers = handleActions({
  [actions.ACTION_TYPES.single.set]: (state, action) => {
    const newState = process(state, action.payload);
    return newState;
  },
  [actions.ACTION_TYPES.all.set]: (state, action) => {
    let updatedState = {...state};
    forEach(action.payload, user => {
      updatedState = process(updatedState, user);
    });
    
    return updatedState;
  },
  [actions.ACTION_TYPES.reset]: () => ({}),
}, 
// Initial State
{});

export const initializeCurrentUserId = handleActions({}, null);

export const resetCurrentUser = (state, action) => {
  if(action.type === actions.ACTION_TYPES.currentUser.reset) {

    return {
      ...state,
      users: {},
      currentUserId: ""
    }
  }

  return state;
}

export const setCurrentUser = (state, action) => {
  if(action.type === actions.ACTION_TYPES.currentUser.set) {
    const currentUser = action.payload;
    const updatedUsers = process(state.users, currentUser);

    return {
      ...state,
      users: updatedUsers,
      currentUserId: currentUser.id
    }
  }

  return state;
}

export const kudosStatisticsByUserReducer = handleActions({
    [actions.ACTION_TYPES.setKudosForUser]: (state, action) => {
      const { kudos } = action.payload;
      const userId = action.id;
      const numKudosGiven= kudos.given;
      const numKudosReceived= kudos.received;
      const newKudosStatisticsByUser = {...state};
      newKudosStatisticsByUser[userId] = { numKudosGiven, numKudosReceived };
      return newKudosStatisticsByUser;
    }
  },
  // Initial state  
  {}
);

export const initializeGroupUsers = handleActions({}, {});

export const groupUsersReducer = handleActions({
  [actions.ACTION_TYPES.setGroupUserReferences]: (state, action) => {
    const loopId = action.id;
    const userReferences = action.payload;
    const groupUsers = {...state.groupUsers};
    groupUsers[loopId] = userReferences;

    // Flush outdated users from the cache
    let needToUpdateUsersCache = false;
    let { users } = state;
    forEach(userReferences, ur => {
      const cachedUser = state.users[ur.id];
      if(cachedUser && cachedUser.newestUpdate < moment(ur.newestUpdate).toDate()) {
        // The cached user is out of date,
        // remove it from the cache
        if(!needToUpdateUsersCache) {
          needToUpdateUsersCache = true;
          users = {...state.users};
        }

        delete users[ur.id];
      }
    });

    const currentState = {
      ...state,
      groupUsers,
      users
    };

    return currentState;
  }
}, {});

  export const userStateReducer = handleActions({
    [actions.ACTION_TYPES.mergeData]: (state, action) => {
      const { userId } = action;
      const newUserState = action.userState;
      const updatedUserStates = {...state};
      const updatedUserState = updatedUserStates[userId] ? {...updatedUserStates[userId]} : new UserState(userId);

      if(
          // Never has an end date set
          !updatedUserState.displayedPostsEndDate
          // We have an end date but the server didn't send one... this means we've hit the end of the 
          // history for this loop. We'll figure out the end date later down...
          || (newUserState.displayedPostsEndDate === undefined && !newUserState.postsOlderThanDisplayedPostsEndDataExist)
          // We have dates, but the new one is older
          || newUserState.displayedPostsEndDate < updatedUserState.displayedPostsEndDate
      ) {
          updatedUserState.displayedPostsEndDate = newUserState.displayedPostsEndDate;
          updatedUserState.postsOlderThanDisplayedPostsEndDataExist = newUserState.postsOlderThanDisplayedPostsEndDataExist;
      }

      // Merge the displayedPostReferences 
      const displayedPostReferences = updatedUserState.displayedPostReferences.slice(0);
      forEach(newUserState.displayedPostReferences, postReference => {
          displayedPostReferences.push(postReference);
      });

      updatedUserState.displayedPostReferences = uniquifyAndSortPostsReferences(displayedPostReferences);

      // Merge the loaded data
      updatedUserState.loadedData = {...updatedUserState.loadedData};
      forEach(newUserState.loadedData, post => { 
          updatedUserState.loadedData[post.id] = post;
      });

      // Merge the displayed errors
      const errors = updatedUserState.errors.slice(0);
      forEach(newUserState.errors, error => {
          errors.push(error);
      });

      updatedUserState.errors = errors;

      // If we don't have a displayedPostsEndDate (because the server didn't send one)
      // Figure it out from the data
      if(!updatedUserState.displayedPostsEndDate && updatedUserState.displayedPostReferences.length > 0) {
          updatedUserState.displayedPostsEndDate = updatedUserState.displayedPostReferences[updatedUserState.displayedPostReferences.length - 1].newestUpdate;
      }

      // All done... merge into parent and return
      updatedUserStates[userId] = updatedUserState;
      return updatedUserStates;
    },
    [actions.ACTION_TYPES.addPostDataToUserData]: (state, action) => {
      const post = action.payload;
      const updatedState = {...state};
      const updatedUserState = updatedState[post.ownerId] ? {...updatedState[post.ownerId]} : new UserState(post.ownerId);
      const updatedLoadedData = {...updatedUserState.loadedData};
      const loadedPost = updatedLoadedData[post.id];

      // If the new post data isn't newer... we'll just return the state as it was when we got it
      let returnValue = state;

      // But.. if it is newer than the already loaded data...
      if(!loadedPost || loadedPost.newestUpdate.getTime() < post.newestUpdate.getTime()) {
          // Merge up all our new stuff
          updatedLoadedData[post.id] = post;
          updatedUserState.loadedData = updatedLoadedData;
          updatedState[post.ownerId] = updatedUserState;
          returnValue = updatedState;
      }

      return returnValue;
  },

  [actions.ACTION_TYPES.removePostsFromUserReferences]: (state, action) => {
    const userId = action.payload;
    const updatedUserStates  = {...state};
    const updatedUserState = {...updatedUserStates[userId]};
    const updatedDisplayedPostReferences = [];
    const updatedLoadedData = {};

    // Roll up the state and return it
    updatedUserState.displayedPostReferences = updatedDisplayedPostReferences;
    updatedUserState.loadedData = updatedLoadedData;
    delete updatedUserState.displayedPostsEndDate;
    updatedUserState.postsOlderThanDisplayedPostsEndDataExist = true;
    updatedUserStates[userId] = updatedUserState;
    return updatedUserStates;
  }
}, {});

export function canCurrentUserCreateNewLoops(state) {
  const { currentUserId } = state
  const currentUser = state.users[currentUserId];

  // If restricting loop creation to specified users and/or loops
  // is not enabled, the them them :)
  if(!configuration.RESTRICT_LOOP_CREATION) {
    return true;
  }

  // If the current user has directly been granted the ability to 
  // create loops, let them :)
  if(currentUser.canCreateLoops) {
    return true;
  }

  const doesCurrentUserBelongToGroupsAllowedLoopCreation = isCurrentUserMemberOfOneOf(state, configuration.RESTRICT_LOOP_CREATION_ALLOWED_LOOPS);

  // If the user belongs to a loop that has been allowed to create 
  // new loops, let them :)
  if(doesCurrentUserBelongToGroupsAllowedLoopCreation) {
    return true;
  }
  
  return false;
}