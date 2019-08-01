import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import configuration from '../configuration';
import * as validationActions from '../actions/validation';


export const VALIDATION_PROCESSING_STATE = {
  initial: 'VALIDATION-PROCESSING-INITIAL',
  complete: 'VALIDATION-PROCESSING-COMPLETE',
  pending: 'VALIDATION-PROCESSING-PENDING',
  error: 'VALIDATION-PROCESSING-ERROR',
}

// Create an initial state with an object validation node for each model type
const initialState = { }
forEach(
  configuration.MODEL_TYPES, 
  modelTypeKey => { 
    initialState[modelTypeKey] = { validationProcessingState: VALIDATION_PROCESSING_STATE.initial };
  });

// Create and export
export const reducers = handleActions({
    [validationActions.ACTION_TYPES.validationPending]: 
        (state, action) => 
          ({
            ...state,
            [action.editingObjectId]: {
              validationProcessingState: VALIDATION_PROCESSING_STATE.pending
            }
          }),

    [validationActions.ACTION_TYPES.validationComplete]:
      (state, action) =>
        ({
          ...state,
          [action.editingObjectId] : {
            validationProcessingState: VALIDATION_PROCESSING_STATE.complete,
            validationResult: action.validationResult
          }
        }),

    [validationActions.ACTION_TYPES.validationError]:
      (state, action) =>
        ({
          ...state,
          [action.editingObjectId] : {
            validationProcessingState: VALIDATION_PROCESSING_STATE.error,
            error: action.error
          }
        }),
    
    [validationActions.ACTION_TYPES.removeValidation]:
      (state, action) => {
        const updatedState = {...state};
        delete updatedState[action.editingObjectId];
        return updatedState;
      }
  },
  initialState
);