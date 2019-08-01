import { createAction } from 'redux-actions';
import forEach from 'lodash/forEach';
import { fetch } from '../../actions/fetch';
import configuration from '../../configuration';
import { StringBuilder } from '../../utilities/StringUtilities';
import { HttpMethods, StandardHeaders } from '../http';
import { isKeyValid } from '../../utilities/ObjectUtilities';

export const ACTION_TYPES = {
  set: 'SET_SEARCH_RESULTS',
  clear: 'CLEAR_SEARCH_RESULTS',
  error: 'FETCH_SEARCH_ERROR',

  setRelatedPlaces: 'SET_RELATED_PLACES',
  setRelatedTags: 'SET_RELATED_TAGS'
};

export const setSearchResults = createAction(ACTION_TYPES.set);
export const clearSearchResults = createAction(ACTION_TYPES.clear);
export const searchError = createAction (ACTION_TYPES.error);
export const setRelatedPlaces = createAction(ACTION_TYPES.setRelatedPlaces);
export const setRelatedTags = createAction(ACTION_TYPES.setRelatedTags);


export const queryRelatedPlaces = postIds => async (dispatch) => {
  try {
    if(!postIds || postIds.length === 0) { return; }

    const json = JSON.stringify({ ids: postIds });

    const result = await dispatch(
      fetch(
        `${configuration.API_SEARCH_URL}/related-places/`, 
        {
          method: HttpMethods.POST,
          body: json,
          headers: StandardHeaders.AJAX
        }));
    
    dispatch(setRelatedPlaces(result.relatedPlaces));
  } catch(error) {
    dispatch(searchError('An error has occurred loading your search results.'));
  }
}

export const queryRelatedTags = postIds => async (dispatch) => {
  try {
    if(!postIds || postIds.length === 0) { return; }

    const json = JSON.stringify({ ids: postIds });

    const result = await dispatch(
      fetch(
        `${configuration.API_SEARCH_URL}/related-tags/`, 
        {
          method: HttpMethods.POST,
          body: json,
          headers: StandardHeaders.AJAX
        }));
    
    dispatch(setRelatedTags(result.relatedTags));
  } catch(error) {
    dispatch(searchError('An error has occurred loading your search results.'));
  }
}


export const querySearch = searchParameters => async (dispatch) => {
  try {
    let paramsAddedCount = 0;
    const urlBuilder = new StringBuilder();
    urlBuilder.append(`${configuration.API_SEARCH_URL}/?`);
    
    forEach(searchParameters, (value, key) => {
      if(key && value) {
        if(paramsAddedCount > 0) {
          urlBuilder.append('&');
        }

        urlBuilder.append(`${key}=${encodeURIComponent(value)}`);
        paramsAddedCount += 1;
      }
    })

    if(paramsAddedCount === 0) {
      throw new Error('Invalid search parameters');
    }

    const searchResults = await dispatch(fetch(urlBuilder.toString(), { method: HttpMethods.GET }));
    const postIds = searchResults.posts.map(pr => pr.id);
    dispatch(queryRelatedPlaces(postIds));
    dispatch(queryRelatedTags(postIds));
    dispatch(setSearchResults(searchResults));
  } catch(error) {
    dispatch(searchError('An error has occurred loading your search results.'));
  };
};

