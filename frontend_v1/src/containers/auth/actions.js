import { createAction } from 'redux-actions';
import Cookies from 'js-cookie';
import configuration from '../../configuration';
import CsrfTokenProvider from '../../services/CsrfTokenProvider';
import { logSimpleAction } from '../telemetry/actions';
import TelemetryActionTypes from '../telemetry/ActionTypesEnum';
import * as userActions from '../users/actions';
import * as groupActions from '../loops/actions';
import * as dashboardActions from '../dashboard/actions';
import * as postActions from '../posts/actions';
import * as membershipActions from '../loops/memberships/actions';
import * as placeActions from '../places/actions';
import * as photoActions from '../photos/actions';
import * as kudosGivenActions from '../kudos/kudosGiven/actions';
import { keyFor } from '../../utilities/ObjectUtilities';

export const ACTION_TYPES = {
  setAuthToken: 'SET_AUTH_TOKEN',
  saveAuthTokenToStorage: 'SAVE-AUTH-TOKEN-TO-STORAGE',
  loadFromStorage: {
    load: 'LOAD-AUTH-FROM-STORAGE',
    pending: 'LOAD-AUTH-FROM-STORAGE-PENDING',
    complete: 'LOAD-AUTH-FROM-STORAGE-COMPLETE',
    error: 'LOAD-AUTH-FROM-STORAGE-ERROR'
  }
};

export const setAuthToken = createAction(ACTION_TYPES.setAuthToken);
export const saveAuthTokenToStorage = createAction(
  ACTION_TYPES.saveAuthTokenToStorage
);
export const loadFromStorage = createAction(ACTION_TYPES.loadFromStorage.load);
export const loadFromStoragePending = createAction(
  ACTION_TYPES.loadFromStorage.pending
);
export const loadFromStorageComplete = createAction(
  ACTION_TYPES.loadFromStorage.complete
);
export const loadFromStorageError = createAction(
  ACTION_TYPES.loadFromStorage.error
);

/**
 * Handles request to load auth from storage
 * @param {StoreStorageService} storeStorageService
 * @param {ReduxStore} store
 */

export function login(credentials) {
  const csrfTokenProvider = new CsrfTokenProvider(Cookies.get);

  
  return dispatch =>
  // TODO use constants for urls
  
    fetch(`${configuration.API_ROOT_URL}/user/login/`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfTokenProvider.getToken()
      }
    }).then(response => {
      if (response.status !== 200) {
        // TODO generalize this, add error text, maybe use axios?
        return Promise.reject();
      }
      return response.json().then(data => {
        dispatch(setAuthToken(data));
        dispatch(saveAuthTokenToStorage({ token: data.token, model: 'Token', key: keyFor({ model: configuration.MODEL_TYPES.token, id: 0 }) }));
        dispatch(logSimpleAction(TelemetryActionTypes.login));
      });
    });
}

export const logout = () => dispatch => {
  dispatch(logSimpleAction(TelemetryActionTypes.logout));
  
  // TODO use constants for urls
  return fetch(`${configuration.API_ROOT_URL}/rest-auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.status !== 200) {
      // TODO generalize this, add error text, maybe use axios?
      return Promise.reject();
    }
    return response.json().then(data => {
      dispatch(setAuthToken(null));
      dispatch(saveAuthTokenToStorage({ token: null, model: 'Token', key: keyFor({ model: configuration.MODEL_TYPES.token, id: 0 }) }));

      // flush private info from the state
      dispatch(userActions.resetCurrentUser());
      dispatch(userActions.resetUsers());
      dispatch(groupActions.resetGroups());
      dispatch(groupActions.setLastVisitedGroupId(""));
      dispatch(dashboardActions.resetAllDashboards());
      dispatch(postActions.resetPosts());
      dispatch(membershipActions.resetMemberships());
      dispatch(placeActions.resetPlaces());
      dispatch(photoActions.resetPhotos());
      dispatch(kudosGivenActions.resetKudosGiven());

      // TODO - are we missing some things here?
    });
  });
}

export function sendPasswordEmail(email) {
  const csrfTokenProvider = new CsrfTokenProvider(Cookies.get);

  const emailData = {
    email
  };

  const data = JSON.stringify(emailData);

  return dispatch =>
    fetch(`${configuration.API_ROOT_URL}/password_reset/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfTokenProvider.getToken()
      }
    }).then(response => {
      if (response.status !== 200) {
        // TODO generalize this, add error text, maybe use axios?
        return Promise.reject();
      }
    });
}

export function submitPasswordReset(uid, token, passwordOne, passwordTwo) {
  const csrfTokenProvider = new CsrfTokenProvider(Cookies.get);

  const passwordData = {
    uid: uid,
    token: token,
    new_password1: passwordOne,
    new_password2: passwordTwo
  };

  const data = JSON.stringify(passwordData);

  return dispatch =>
    fetch(`${configuration.API_ROOT_URL}/rest-auth/password/reset/confirm/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfTokenProvider.getToken()
      }
    }).then(response => {
    });
}
