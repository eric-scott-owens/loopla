import {handleActions} from 'redux-actions';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import values from 'lodash/values';
import get from 'lodash/get';

import { ACTION_TYPES } from './actions';
import DashboardState from './DashboardState';
import { fromClientPostObjectToClientPostReferenceObject } from '../posts/mappers';

export const initializeSelectedLoop = handleActions({}, null);

/**
 * Returns a new array containing only the newest, unique post references
 * @param {postReference[]} postReferences - the post references to deduplicate
 */
function uniquifyAndSortPostsReferences(postReferences) {
    const index = {};
    forEach(postReferences, postReference => {
        if(!index[postReference.id]) {
            index[postReference.id] = postReference;
        } else if(index[postReference.id].newestUpdate.getTime() < postReference.newestUpdate.getTime()) {
            index[postReference.id] = postReference;
        }
    });

    const newestUniquePostReferences = values(index);
    newestUniquePostReferences.sort((a, b) => b.newestUpdate -  a.newestUpdate);

    return newestUniquePostReferences;
}

export const dashboardStatesReducer = handleActions({
    [ACTION_TYPES.mergeData]: (state, action) => {
        const { groupId } = action;
        const newDashboardState = action.dashboardState;
        const updatedDashboardStates = {...state};
        const updatedDashboardState = updatedDashboardStates[groupId] ? {...updatedDashboardStates[groupId]} : new DashboardState(groupId);

        if(
            // Never has an end date set
            !updatedDashboardState.displayedPostsEndDate
            // We have an end date but the server didn't send one... this means we've hit the end of the 
            // history for this loop. We'll figure out the end date later down...
            || (newDashboardState.displayedPostsEndDate === undefined && !newDashboardState.postsOlderThanDisplayedPostsEndDataExist)
            // We have dates, but the new one is older
            || newDashboardState.displayedPostsEndDate < updatedDashboardState.displayedPostsEndDate
        ) {
            updatedDashboardState.displayedPostsEndDate = newDashboardState.displayedPostsEndDate;
            updatedDashboardState.postsOlderThanDisplayedPostsEndDataExist = newDashboardState.postsOlderThanDisplayedPostsEndDataExist;
        }

        if(updatedDashboardState.categoryIdFilter !== newDashboardState.categoryIdFilter) {
            updatedDashboardState.displayedPostReferences = [];
            updatedDashboardState.categoryIdFilter = newDashboardState.categoryIdFilter;
        }

        forEach(newDashboardState.displayedPostReferences, postReference => {
            updatedDashboardState.displayedPostReferences.push(postReference);
        });

        updatedDashboardState.displayedPostReferences = uniquifyAndSortPostsReferences(updatedDashboardState.displayedPostReferences);

        // Merge the displayed errors
        const errors = updatedDashboardState.errors.slice(0);
        forEach(newDashboardState.errors, error => {
            errors.push(error);
        });

        updatedDashboardState.errors = errors;

        // If we don't have a displayedPostsEndDate (because the server didn't send one)
        // Figure it out from the data
        if(!updatedDashboardState.displayedPostsEndDate && updatedDashboardState.displayedPostReferences.length > 0) {
            updatedDashboardState.displayedPostsEndDate = updatedDashboardState.displayedPostReferences[updatedDashboardState.displayedPostReferences.length - 1].newestUpdate;
        }

        // All done... merge into parent and return
        updatedDashboardStates[groupId] = updatedDashboardState;
        return updatedDashboardStates;
    },

    [ACTION_TYPES.reset]: (state, action) => {
        const { groupId } = action;
        const updatedDashboardStates = {...state};
        updatedDashboardStates[groupId] = new DashboardState(groupId);
        return updatedDashboardStates
    },

    [ACTION_TYPES.resetAll]: () => ({}),

    [ACTION_TYPES.addError]: (state, action) => {
        const { groupId, errorMessage } = action;
        const updatedDashboardStates = {...state};
        const updatedDashboardState = updatedDashboardStates[groupId] ? {...updatedDashboardStates[groupId]} : new DashboardState(groupId);
        updatedDashboardState.errors = updatedDashboardState.errors.slice(0);
        updatedDashboardState.errors.push(errorMessage);
        updatedDashboardStates[groupId] = updatedDashboardState;
        return updatedDashboardStates;
    }

}, {});

function removeOutdatedPostsFromReduxState(state, newPostReferences) {
    const updatedState = {...state};
    const updatedPosts = {...updatedState.posts};
    
    let hasChange = false;
    forEach(newPostReferences, postReference => {
        const post = get(updatedPosts, postReference.id);
        if(post && post.newestUpdate.getTime() < postReference.newestUpdate.getTime()) {
            hasChange = true;
            delete updatedPosts[postReference.id];
        }
    });

    let returnValue = state;
    if(hasChange) {
        returnValue = updatedState;
        updatedState.posts = updatedPosts;
    }
    
    
    return returnValue;
}

export const globallyScopedReducers = handleActions({
    [ACTION_TYPES.receiveNewDashboardPostData]: (state, action) => {
        const posts = action.payload;
        if(!posts || posts.length === 0) return state;

        const groupsWithNewDataIndex = {};
        let updatedState = {...state};
        const updatedDashboardStates = {...updatedState.dashboardStates};
        forEach(posts, post => {
            const { groupId } = post;
            const updatedDashboardState = updatedDashboardStates[groupId] ? {...updatedDashboardStates[groupId]} : new DashboardState(groupId);
            groupsWithNewDataIndex[groupId] = true;

            // Insert the post references
            const displayedPostReferences = updatedDashboardState.displayedPostReferences.slice(0);
            displayedPostReferences.splice(0, 0, fromClientPostObjectToClientPostReferenceObject(post));
            updatedDashboardState.displayedPostReferences = displayedPostReferences;
            
            // Merge the updated dashboardState into the set of all dashboard states
            updatedDashboardStates[groupId] = updatedDashboardState;
        })
        
        // Sort all of the affected dashboards displayPostReferences arrays
        const groupIds = keys(groupsWithNewDataIndex);
        forEach(groupIds, groupId => {
            const updatedDashboardState = updatedDashboardStates[groupId]; // Don't need spread operator because  all of these groups are already new objects
            updatedDashboardState.displayedPostReferences = uniquifyAndSortPostsReferences(updatedDashboardState.displayedPostReferences);
            updatedState = removeOutdatedPostsFromReduxState(updatedState, updatedDashboardState.displayedPostReferences);
        });

        updatedState.dashboardStates = updatedDashboardStates;
        return updatedState;
    },

    [ACTION_TYPES.addPostDataToDashboardReferences]: (state, action) => {
        const post = action.payload;
        const postReference = fromClientPostObjectToClientPostReferenceObject(post);
        let updatedState = {...state};
        const updatedDashboardStates = {...updatedState.dashboardStates};
        const updatedDashboardState = updatedDashboardStates[post.groupId] ? {...updatedDashboardStates[post.groupId]} : new DashboardState(post.groupId);
        const displayedPostReferences = updatedDashboardState.displayedPostReferences.slice(0);

        // Add the new post to the post references
        displayedPostReferences.push(postReference);
        
        // Sort and merge up the data
        updatedDashboardState.displayedPostReferences = uniquifyAndSortPostsReferences(displayedPostReferences);
        updatedState = removeOutdatedPostsFromReduxState(updatedState, updatedDashboardState.displayedPostReferences);
        updatedDashboardStates[post.groupId] = updatedDashboardState;
        updatedState.dashboardStates = updatedDashboardStates

        return updatedState;
    },

    [ACTION_TYPES.removePostFromDashboardReferences]: (state, action) => {
        const post = action.payload;
        const updatedState  = {...state};
        const updatedDashboardStates = {...updatedState.dashboardStates};
        const updatedDashboardState = {...updatedDashboardStates[post.groupId]};
        const updatedDisplayedPostReferences = updatedDashboardState.displayedPostReferences.slice(0);

        // Find the index of the post in the displayed post references so we can kill it
        let indexToRemove = -1;
        forEach(updatedDisplayedPostReferences, (postReference, index) => {
            if(postReference.id === post.id) {
                indexToRemove = index;
            }

            return indexToRemove > -1; // Bail out if we've found our number
        });

        // Remove the post from the displayed post references
        updatedDisplayedPostReferences.splice(indexToRemove, 1);

        // Roll up the state and return it
        updatedDashboardState.displayedPostReferences = updatedDisplayedPostReferences;
        updatedDashboardStates[post.groupId] = updatedDashboardState;
        updatedState.dashboardStates = updatedDashboardStates;

        return updatedState;
    }

}, {});