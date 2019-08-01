import { createAction } from 'redux-actions';
import moment from 'moment';

import forEach from 'lodash/forEach';
import { fetch } from '../../actions/fetch';
import configuration from '../../configuration';
import { HttpMethods, StandardHeaders } from '../http';
import { fromServerPostReferenceObject } from '../posts/mappers';
import DashboardState from './DashboardState';

export const ACTION_TYPES = {
    mergeData: 'LOOP-DASHBOARD-MERGE',
    reset: 'LOOP-DASHBOARD-RESET',
    resetAll: 'LOOP-DASHBOARD-RESET-ALL',
    addError: 'LOOP-DASHBOARD-ADD-ERROR',

    receiveNewDashboardPostData: 'LOOP-DASHBOARD-RECEIVE-NEW-POST-DATA',
    addPostDataToDashboardReferences: 'LOOP-DASHBOARD-ADD-POST-REFERENCE',
    removePostFromDashboardReferences: 'LOOP-DASHBOARD-REMOVE-POST-REFERENCE',
    addPostDataToDashboardData: 'LOOP-DASHBOARD-ADD-POST-DATA'
};


export const addPostToDashboardData = (clientPostObject) => ({
    type: ACTION_TYPES.addPostDataToDashboardData,
    payload: clientPostObject
});

export const addPostToDashboardReferences = (clientPostObject) => ({
    type: ACTION_TYPES.addPostDataToDashboardReferences,
    payload: clientPostObject
});

export const removePostFromDashboardReferences = (post) => ({
    type: ACTION_TYPES.removePostFromDashboardReferences,
    payload: post
});

export const mergeDashboardState = (groupId, dashboardState) => ({
    type: ACTION_TYPES.mergeData,
    groupId,
    dashboardState
});

export const resetDashboardStatus = (groupId) => ({
    type: ACTION_TYPES.reset,
    groupId
});

export const addErrorToDashboard = (groupId, errorMessage) => ({
    type: ACTION_TYPES.addError,
    groupId,
    errorMessage
})

export const resetAllDashboardStatuses = createAction(ACTION_TYPES.resetAll);
export const receiveNewDashboardPostData = createAction(ACTION_TYPES.receiveNewDashboardPostData);

export const resetDashboard = (groupId) => async (dispatch) => {
    try {
        dispatch(resetDashboardStatus(groupId));
    }
    catch(error) {
        dispatch(addErrorToDashboard(groupId, "An error occurred while fetching posts."));
    }
};

export const resetAllDashboards = () => async (dispatch) => {
    dispatch(resetAllDashboardStatuses());
};


export const getPostsReferencesOlderThan = (olderThan, groupId, categoryId, targetBatchSize) => async (dispatch) => {
    try {
        const json = JSON.stringify({
            older_than: olderThan ? moment(olderThan).format('YYYY-MM-DDTHH:mm:ss.SSSSSS') : undefined,
            group_id: groupId,
            category_id: categoryId,
            target_batch_size: targetBatchSize
        })
        
        const params = {
            method: HttpMethods.POST,
            body: json,
            headers: StandardHeaders.AJAX
        };

        const result = await dispatch(fetch(`${configuration.API_ROOT_URL}/post/older-than/`, params));

        // Create dashboard state from result data
        const dashboardState = new DashboardState(groupId);
        dashboardState.displayedPostsEndDate = result.endDate ? moment(result.endDate).toDate() : undefined;
        dashboardState.postsOlderThanDisplayedPostsEndDataExist = (result.postsOlderThanEndDateExist === true);
        dashboardState.displayedPostReferences = result.posts.map(pr => fromServerPostReferenceObject(pr));
        dashboardState.categoryIdFilter = categoryId;    

        // Merge the new dashboard state data
        dispatch(mergeDashboardState(groupId, dashboardState));
    } catch(error) {
        dispatch(addErrorToDashboard(groupId, "An error occurred while fetching posts."));
    }
}

export const addPostToDashboardsLoadedData = (clientPostObject) => (dispatch) => {
    dispatch(addPostToDashboardData(clientPostObject));
};