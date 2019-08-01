import { createAction } from 'redux-actions';
import keys from 'lodash/keys';
import * as fetchResourceActions from '../../actions/fetchResource';
import configuration from '../../configuration';
import { fetch } from '../../actions/fetch';


export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-TAGS',
    set: 'SET-TAGS'
  },
  single: {
    fetch: 'FETCH-TAG',
    set: 'SET-TAG'
  }, 
  setTopTagsForGroup: 'SET-TOP-TAGS-FOR-GROUP'
}

export const setTag = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});


export const setTopTagsForGroup = (id, payload) => ({
  type: ACTION_TYPES.setTopTagsForGroup,
  id,
  payload,
});

export const setTags = createAction(ACTION_TYPES.all.set);

export const fetchTag = tagId => async dispatch => {
  try{
    const tag = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.tag, tagId));
    dispatch(setTag(tagId, tag));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchTags = () => async dispatch => {
  try {
    const tags = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.tag));
    dispatch(setTags(tags));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const batchFetchTags = (ids) => async dispatch => {
  try {
    const results = await dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.tag, ids));
    dispatch(setTags(results.loaded));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchTopTagsForGroup = (groupId) => async dispatch => {
  try{
    const result = await dispatch(fetch(`${configuration.API_ROOT_URL}/top-tags/?groupId=${groupId}`, {method: 'GET'}));
    const { topTags } = result;
    dispatch(batchFetchTags(topTags));
    dispatch(setTopTagsForGroup(groupId, topTags));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}
