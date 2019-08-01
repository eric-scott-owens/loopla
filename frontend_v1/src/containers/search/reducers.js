import cloneDeep from 'lodash/cloneDeep';
import { handleActions } from 'redux-actions';
import forEach from 'lodash/forEach';
import moment from 'moment';

import configuration from '../../configuration';
import * as searchActions from './actions';
import { fromServerSearchResult } from './mappers';
import { ACTION_TYPES as fetchActionTypes } from '../../actions/fetch';

export const initialState = {
  posts: [],
  mentionedPlaces: [],
  relatedTags: [],
  error: null, 
  isLoading: false
};

export const searchResultReducers = handleActions(
  {
    [searchActions.ACTION_TYPES.error]: (state, action) => ({ ...state, error: action.payload }),
    [searchActions.ACTION_TYPES.clear]: () => ({...initialState}),
    [fetchActionTypes.pending]: (state, action) => {
      if(action.url.indexOf(configuration.API_SEARCH_URL) !== 0) {
        // Not a search action, 
        return state;
      }

      return {
        ...state,
        isLoading: true
      }
    },
    [fetchActionTypes.error]: (state, action) => {
      if(action.url.indexOf(configuration.API_SEARCH_URL) !== 0) {
        // Not a search action, 
        return state;
      }

      return {
        ...state,
        isLoading: false
      }
    },
    [fetchActionTypes.complete]: (state, action) => {
      if(action.url.indexOf(configuration.API_SEARCH_URL) !== 0) {
        // Not a search action, 
        return state;
      }

      return {
        ...state,
        isLoading: false
      }
    },
    [searchActions.ACTION_TYPES.setRelatedPlaces]: (state, action) => {
      const updatedState = {...state};
      updatedState.mentionedPlaces = 
        action.payload.map(pr => ({ 
          id: pr.id, 
          ownerIds: pr.ownerIds.slice(0) 
        }));

      return updatedState;
    },
    [searchActions.ACTION_TYPES.setRelatedTags]: (state, action) => {
      const updatedState = {...state};
      updatedState.relatedTags = action.payload.map(tr => tr.id)
      return updatedState;
    } 
  },
  cloneDeep(initialState)
);

export const globalReducer = handleActions({
    [searchActions.ACTION_TYPES.set]: (state, action) => {
      const searchResult = action.payload;
      const mappedSearchResult = fromServerSearchResult(searchResult);

      // Flush outdated posts from the cache
      let needToUpdatePostsCache = false;
      let { posts } = state;
      forEach(searchResult.posts, pr => { 
          const cachedPost = state.posts[pr.id];
          if(cachedPost && cachedPost.newestUpdate < moment(pr.newestUpdate).toDate()) {
              // The cached post is out of date, 
              // remove it from the cache
              if(!needToUpdatePostsCache) {
                  needToUpdatePostsCache = true;
                  posts = {...state.posts};
              }
              
              delete posts[pr.id];
          }
      });

      return {
          ...state,
          searchResult: mappedSearchResult
      };
    }
  },
  {}
);

