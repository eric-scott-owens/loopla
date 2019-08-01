import { createAction } from 'redux-actions';
import { fetch } from '../../../actions/fetchResource'
import configuration from '../../../configuration';
import { fromServerKudosGivenObject } from './mappers';

export const ACTION_TYPES = {
  single: {
    fetch: 'FETCH-KUDOS-GIVEN',
    set: 'SET-KUDOS-GIVEN'
  },
  reset: 'RESET-KUDOS-GIVEN',

  eventReceivers: {
    kudosGiven: 'KUDOS-GIVEN-EVENT-RECEIVED',
  }
}

export const resetKudosGiven = createAction(ACTION_TYPES.reset);
export const kudosGivenEventReceived = createAction(ACTION_TYPES.eventReceivers.kudosGiven)

export const setKudosGiven = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});

export const fetchKudosGiven = id => async dispatch => {
  try {
    const kudosGiven = await dispatch(fetch(configuration.MODEL_TYPES.kudosGiven));
    const mappedKudosGiven = fromServerKudosGivenObject(kudosGiven);
    dispatch(setKudosGiven(id, mappedKudosGiven));
  } catch (error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

