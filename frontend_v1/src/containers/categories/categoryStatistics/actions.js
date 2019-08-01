import { createAction } from 'redux-actions';
import * as fetchActions from '../../../actions/fetch';
import configuration from '../../../configuration';
import { StringBuilder } from '../../../utilities/StringUtilities';
import { HttpMethods } from '../../http';
import { fromServerCategoryStatisticsObject } from './mappers';

export const ACTION_TYPES  = {
  setCategoryStatistics: 'SET-CATEGORY-STATISTICS'
};

export const setCategoryStatistics = createAction(ACTION_TYPES.setCategoryStatistics);

export const fetchCategoryStatistics = (options) => async dispatch => {
  try {
    
    // Build the URL for the request
    const urlBuilder = new StringBuilder();
    urlBuilder.append(`${configuration.API_ROOT_URL}/category-statistics/`);
    
    if(options) {
      let needsAmpersand = false;

      if(options.groupId || options.categoryId) {
        urlBuilder.append('?')
      }

      if(options.groupId) {
        urlBuilder.append(`group_id=${options.groupId}`);
        needsAmpersand = true;
      }

      if(options.categoryId) {
        if(needsAmpersand) {
          urlBuilder.append('&');
        }

        urlBuilder.append(`category_id=${options.categoryId}`);
      }
    }

    const url = urlBuilder.toString();
    const params = {
      method: HttpMethods.GET
    }

    const categoryStatistics = await dispatch(fetchActions.fetch(url, params));
    const mappedCategoryStatistics = categoryStatistics.map(cs => fromServerCategoryStatisticsObject(cs));
    dispatch(setCategoryStatistics(mappedCategoryStatistics));
  } catch(error) {
    // The the fetch resource reducers take care of the error notifications
  }
}