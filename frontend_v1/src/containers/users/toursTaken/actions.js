import { createAction } from 'redux-actions';
import decamelize from 'decamelize';

import configuration from '../../../configuration';
import { fetch } from '../../../actions/fetch';
import { HttpMethods, StandardHeaders } from '../../http';


export const ACTION_TYPES = {
  updateTakenTours: 'UPDATE-TAKEN-TOURS'
}


export const updateTakenTours = createAction(ACTION_TYPES.updateTakenTours);


export const reportTakenTour = (tourName) => async(dispatch) => {
  const serverTourName = decamelize(tourName);
  const json = JSON.stringify({ tour_taken: serverTourName });
  try{
    dispatch(
      fetch(
        `${configuration.API_ROOT_URL}/user/report-taken-tour/`,
        { 
          method: HttpMethods.POST, 
          body: json,
          headers: StandardHeaders.AJAX
        }
      ));

    dispatch(updateTakenTours(tourName));
  } catch(error) {
    // What should I do with this error?
  }
}