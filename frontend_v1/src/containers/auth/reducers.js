import { handleActions } from 'redux-actions';
import * as userActions from './actions';
import globalPostLoginTaskRunner from './globalPostLoginTaskRunner';


const initialState = {
  authToken: undefined
};

export default handleActions(
  {
    [userActions.ACTION_TYPES.setAuthToken]: (state, action) => {
      let authToken;
      if(action.payload !== null) {
        authToken = action.payload.token;
      }
      else {
        authToken = null;
      }

      if(authToken) {
        globalPostLoginTaskRunner.receiveLoggedInEvent();
      } else {
        globalPostLoginTaskRunner.receiveLoggedOutEvent();
      }

      return {
        ...state,
        authToken
      };
     
    }, 
    [userActions.ACTION_TYPES.loadFromStorage.complete]: (state, action) => {
      if(action.payload.length !== 0) {
        const tokenObject = action.payload;
        const { token } = tokenObject;

        // Update the global postLoginTa
        if(token) {
          globalPostLoginTaskRunner.receiveLoggedInEvent();
        }
        
        return {
          ...state,
          authToken: token
        };
      }
      
      return {
        ...state,
        authToken: null
      };
    }
  },
  initialState
);

export function isLoggedIn(state) {
  return !!state.user.authToken;
}