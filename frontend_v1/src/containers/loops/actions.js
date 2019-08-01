import { createAction } from 'redux-actions';
import configuration from '../../configuration';
import * as fetchResourceActions from '../../actions/fetchResource';

export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-GROUPS',
    set: 'SET-GROUPS'
  },
  single: {
    fetch: 'FETCH-GROUP',
    set: 'SET-GROUP'
  },
  setLastVisitedGroupId: 'LAST-VISITED-GROUP-ID', 
  create: 'CREATE-GROUP',
  update: 'UPDATE-GROUP',
  reset: 'RESET-GROUPS'
}

export const setLastVisitedGroupId = createAction(ACTION_TYPES.setLastVisitedGroupId);

export const setGroup = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});


export const setGroups = createAction(ACTION_TYPES.all.set);

export const resetGroups = createAction(ACTION_TYPES.reset);

export const fetchGroup = groupId => async dispatch => {
  try{
    const group = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.group, groupId));
    dispatch(setGroup(groupId, group));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchGroups = () => async dispatch => {
  try {
    const groups = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.group, undefined, true));
    dispatch(setGroups(groups));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const createGroup = (group) => async (dispatch) => {
  try {
    const postedGroup = await dispatch(fetchResourceActions.post(configuration.MODEL_TYPES.group, group));
    dispatch(setGroup(postedGroup.id, postedGroup));
    return postedGroup;
  } catch(error) {
    // TODO: error handling here
    return error;
  }
}

export const updateGroup = (group) => async (dispatch) => {
  try {
    const postedGroup = await dispatch(fetchResourceActions.patch(configuration.MODEL_TYPES.group, group));
    dispatch(setGroup(postedGroup.id, postedGroup));
  } catch(error) {
    // TODO: error handling here
  }
}