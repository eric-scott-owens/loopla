import { fetch } from '../../actions/fetch';
import configuration from '../../configuration';
import { HttpMethods } from '../http';
import { fromClientRegistrationRequestObject } from './mappers';
import { fromServerUserObject } from '../users/mappers';
import { setUser } from '../users/actions';

export const isEmailRegistered = (email) => async (dispatch) => {
  try {
    const json = JSON.stringify({ email });
    const response = 
      await dispatch(
        fetch(
          `${configuration.API_ROOT_URL}/registration/is-email-registered/`, 
          { 
            method: HttpMethods.POST,
            body: json,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }));
    
    return response.isRegistered;
  }
  catch(error) {
    throw error;
  }
}

export const isUsernameRegistered = (username) => async (dispatch) => {
  try {
    const json = JSON.stringify({ username });
    const response = 
      await dispatch(
        fetch(
          `${configuration.API_ROOT_URL}/registration/is-username-registered/`, 
          { 
            method: HttpMethods.POST,
            body: json,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }));
    
    return response.isRegistered;
  }
  catch(error) {
    throw error;
  }
}

export const validateNewPassword = (password) => async (dispatch) => {
  try {
    const json = JSON.stringify({ password });
    const response = 
      await dispatch(
        fetch(
          `${configuration.API_ROOT_URL}/registration/validate-new-password/`,
          {
            method: HttpMethods.POST,
            body: json,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }));
    
    return response.validationErrors;
  }
  catch(error) {
    throw error;
  }
}

export const registerNewUser = (registrationRequest) => async (dispatch) => {
  try {
    const serverModel = fromClientRegistrationRequestObject(registrationRequest);
    const json = JSON.stringify(serverModel);
    const newServerUser = 
      await dispatch(
        fetch(
          `${configuration.API_ROOT_URL}/registration/register-new-user/`,
          {
            method: HttpMethods.POST,
            body: json,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }));

    dispatch(setUser(newServerUser.id, newServerUser));
    const newUser = fromServerUserObject(newServerUser);
    return newUser;
  }
  catch(error) {
    throw error;
  }
}