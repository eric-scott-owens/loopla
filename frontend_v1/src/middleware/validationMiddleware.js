import get from 'lodash/get';
import * as validationActions from '../actions/validation';

/* eslint-disable-next-line */
export default store => next => async action => {

  // If validateObject has been dispatched and a validator exists
  // for the specified dataType, then run the validator
  if(action.type === validationActions.ACTION_TYPES.validateObject) {
    const { validator } = action;
    if(validator) {
      // dispatch an event indicating validation has started
      store.dispatch(validationActions.validationPending(action.dataType, action.editingObjectId));
  
      // Try to run the requested validator
      try {
        const state = store.getState();
        const dispatch = store.dispatch.bind(store);
        const editingObject = get(state, `editingObjects.${action.editingObjectId}`, null);
        const validationResult = await validator.validate(editingObject, state, dispatch);
        store.dispatch(validationActions.validationComplete(action.dataType, action.editingObjectId, validationResult))
        return validationResult;
      }
      catch(error) {
        store.dispatch(validationActions.validationError(action.dataType, action.editingObjectId, error));
      }
    }

  }

  return next(action);
}