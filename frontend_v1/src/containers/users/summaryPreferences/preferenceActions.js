import forEach from 'lodash/forEach';
import { fetch } from '../../../actions/fetch';
import * as fetchResourceActions from '../../../actions/fetchResource';
import configuration from '../../../configuration';
import { fromServerSummaryPreferenceObject} from './mappers';

export const ACTION_TYPES = {
  summary: {
    user: {
      fetch: 'FETCH-SUMMARY-PREFERENCES-FOR-USER',
      set: 'SET-SUMMARY-PREFERENCES-FOR-USER'
    },
    group: {
      fetch: 'FETCH-SUMMARY-PREFERENCES-FOR-GROUP',
      set: 'SET-SUMMARY-PREFERENCES-FOR-GROUP'
    }
  },
  notification: {
    user: {
      fetch: 'FETCH-NOTIFICATION-PREFERENCES-FOR-USER',
      set: 'SET-NOTIFICATION-PREFERENCES-FOR-USER'
    },
    group: {
      fetch: 'FETCH-NOTIFICATION-PREFERENCES-FOR-GROUP',
      set: 'SET-NOTIFICATION-PREFERENCES-FOR-GROUP'
    }
  },
}

export const setSummaryPreferencesForUser = (id, payload) => ({
  type: ACTION_TYPES.summary.user.set,
  id,
  payload,
});

export const setSummaryPreferencesForGroup = (id, payload) => ({
  type: ACTION_TYPES.summary.group.set,
  id,
  payload,
});

export const fetchSummaryPreferencesForUser = userId => async dispatch => {
  try{
    const summaryPreferences = await dispatch(fetch(`${configuration.API_ROOT_URL}/summary-preferences/?userId=${userId}`, {method: 'GET'}));
    const mappedSummaryPreferences = summaryPreferences.map(p => fromServerSummaryPreferenceObject(p));
    dispatch(setSummaryPreferencesForUser(userId, mappedSummaryPreferences));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchMemberSummaryPreferencesForGroup = groupId => async dispatch => {
  try {
    const summaryPreferences = await dispatch(fetch(`${configuration.API_ROOT_URL}/summary-preferences/?groupId=${groupId}`, {method: 'GET'})); 
    const mappedSummaryPreferences = summaryPreferences.map(p => fromServerSummaryPreferenceObject(p));
    dispatch(setSummaryPreferencesForGroup(mappedSummaryPreferences));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const updateSummaryPreferences = (userId, summaryPreferences) => async dispatch => {
  try {
    const updatedPreferences = [];
    const promises = [];

    forEach(summaryPreferences, pref => {

      promises.push(dispatch(fetchResourceActions.patch(configuration.MODEL_TYPES.summaryPreference, pref))
      .then((data) => {
        updatedPreferences.push(data);
      })
      );

    })

      Promise.all(promises).then(() => dispatch(setSummaryPreferencesForUser(userId, updatedPreferences)));
    
  } catch(error) {
    // TODO: error handling here
  }
}