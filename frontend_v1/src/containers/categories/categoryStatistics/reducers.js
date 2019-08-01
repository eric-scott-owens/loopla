import { handleActions } from 'redux-actions';
import forEach from 'lodash/forEach';
import { ACTION_TYPES } from './actions';

export function process(state, categoryStatistics) {
  const updatedState = {...state};
  const updatedCategoryStatistics = {...updatedState.categoryStatistics};
  updatedCategoryStatistics[categoryStatistics.id] = categoryStatistics;
  updatedState.categoryStatistics = updatedCategoryStatistics;

  // Invalid portions of the cache that are out of date.
  forEach(categoryStatistics.postReferences, postReference => {
    const loadedPost = updatedState.posts[postReference.id];
    if(loadedPost && loadedPost.newestUpdate !== postReference.newestUpdate) {
      const updatedPosts = {...updatedState.posts}; // Only create a new posts 'table' if we really need to
      delete updatedPosts[postReference.id];
      updatedState.posts = updatedPosts;

      // HACK - directly removing from local storage...
      // This should be cleaned up to work via the storeStorage service
      if(window && window.localStorage) {
        localStorage.removeItem(postReference.key);
      }
    }
  });

  return updatedState;
}

// Just an initializer for now...
export const reducers = handleActions({},{});

// Globally scoped reducers
export const globalReducers = handleActions({
  [ACTION_TYPES.setCategoryStatistics]: (state, action) => {
    let updatedState = state;
    const categoryStatisticsCollection = action.payload;

    forEach(categoryStatisticsCollection, categoryStatistic => {
      updatedState = process(updatedState, categoryStatistic);
    });

    return updatedState;
  }
}, {});