import { fetch } from '../../../actions/fetch';
import configuration from '../../../configuration';
import * as fetchResourceActions from '../../../actions/fetchResource';
import { HttpMethods } from '../../http';
import { fromServerKudosAvailableObject } from './mappers';


export const ACTION_TYPES = {
  setAvailableKudos: 'SET-AVAILABLE-KUDOS',
  setFullKudo: 'SET-FULL-KUDO',
  clearAvailableKudos: 'CLEAR-AVAILABLE-KUDOS'
};

export const setAvailableKudos = (payload) => ({
  type: ACTION_TYPES.setAvailableKudos,
  payload
});

export const setFullKudo = (payload) => ({
  type: ACTION_TYPES.setFullKudo,
  payload
});

export const clearAvailableKudos = () => ({
  type: ACTION_TYPES.clearAvailableKudos
});

// eslint-disable-next-line import/prefer-default-export
export const getAvailableKudos = () => async dispatch => {
  try {
      const kudosAvailable = await dispatch(fetch(`${configuration.API_ROOT_URL}/available-kudos/`, {method: HttpMethods.GET}));
      const mappedKudosAvailable = fromServerKudosAvailableObject(kudosAvailable);
      dispatch(setAvailableKudos(mappedKudosAvailable));
      return kudosAvailable;
  } catch(error) {
      throw error;
  }
}

export const getFullKudo = (kudoId) => async dispatch => {
  try {
    const kudo = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.kudos, kudoId));
    dispatch(setFullKudo(kudo));
    return kudo;
  } catch(error) {
      throw error;
  }
}
