import { combineReducers } from 'redux';

import { reducers as validationReducers } from './validation';
import * as postsReducers from '../containers/posts/reducers';
import * as commentReducers from '../containers/comments/reducers';
import * as users from '../containers/users/reducers';
import * as preferences from '../containers/users/summaryPreferences/preferenceReducers';
import { groupsReducers, lastVisitedGroupIdReducer } from '../containers/loops/reducers';
import photoReducers from '../containers/photos/reducers';
import placeReducers from '../containers/places/reducers';
import { tagsReducers, topTagReducer } from '../containers/tags/reducers';
import googlePlaceReducers from '../containers/places/googlePlaces/reducers';
import * as editingObjectReducers from './editingObjects';
import * as fetchResource from './fetchResource';
import user from '../containers/auth/reducers';
import { globallyScopedReducers as toursTakenReducers } from '../containers/users/toursTaken/reducers';
import * as membershipReducers from '../containers/loops/memberships/reducers';
import * as invitationReducers from '../containers/loops/invitations/reducers';
import * as catalogReducers from '../containers/catalogItems/reducers';
import { initializeKudos } from '../containers/kudos/reducers';
import * as availableKudosReducers from '../containers/kudos/availableKudos/reducers';
import * as kudosGivenReducers from '../containers/kudos/kudosGiven/reducers';

import * as categoryReducers from '../containers/categories/reducers';
import * as categoryStatisticReducers from '../containers/categories/categoryStatistics/reducers';

import { 
  globalReducer as searchResultGlobalReducer, 
  searchResultReducers as searchResult,
} from '../containers/search/reducers';

import { dashboardStatesReducer as dashboardStates, globallyScopedReducers as dashboardGloballyScopedReducers, initializeSelectedLoop } from '../containers/dashboard/reducers';

import { scopedReducers as inPageFinderReducers } from '../containers/search/inPageFinder/reducers';
import * as  multiUseInvitationReducers from '../containers/loops/multiUseInvitations/reducers';



// To register reducers that handle their own slice of the data
// put them here
const reducers = combineReducers({
  searchResult, // The stub reducer provides the initial state
  dashboardStates,
  userStates: users.userStateReducer,
  posts: postsReducers.initializePosts,
  postCountByGroup: postsReducers.postCountByGroupReducer,
  postCountByUser: postsReducers.postCountByUserReducer,
  comments: commentReducers.commentScopedReducers,
  commentCountByUser: commentReducers.commentCountByUserReducer,
  catalogItems: catalogReducers.initializeCatalogItems,
  availableKudos: availableKudosReducers.initializeAvailableKudos,
  kudos: initializeKudos,
  currentUserId: users.initializeCurrentUserId,
  categories: categoryReducers.reducers,
  categoryStatistics: categoryStatisticReducers.reducers,
  lastVisitedCategoryId: categoryReducers.lastVisitedCategoryIdReducer,
  users: users.userReducers,
  selectedLoop: initializeSelectedLoop,
  groups: groupsReducers,
  groupUsers: users.initializeGroupUsers,
  lastVisitedGroupId: lastVisitedGroupIdReducer,
  invitations: invitationReducers.invitationReducers,
  multiUseInvitations: multiUseInvitationReducers.multiUseInvitationReducers,
  memberships: membershipReducers.membershipReducers,
  summaryPreferences: preferences.reducers,
  photos: photoReducers,
  places: placeReducers,
  tags: tagsReducers,
  topTags: topTagReducer,
  googlePlaces: googlePlaceReducers,
  editingObjects: editingObjectReducers.reducers,
  validation: validationReducers,
  user,
  kudosStatisticsByUser: users.kudosStatisticsByUserReducer,
  invitationPage: invitationReducers.invitationPageReducer,
  inPageFinderContext: inPageFinderReducers,
  kudosGiven: kudosGivenReducers.reducers,
  multiUseInvitationPage: multiUseInvitationReducers.multiUseInvitationPageReducer
});

// Here we add on reducers than can modify the entire state
function defaultAndCustomReducers(state, action) {
  // Use all the reducers composed with combineReducers
  let updatedState = reducers(state, action);

  // The reducer for search results patches in objects all over
  // the state (such as posts and short list items) when it 
  // returns its results. Let it do it's work if needed before
  // handing off to all the other reducers 
  updatedState = users.setCurrentUser(updatedState, action);
  updatedState = users.resetCurrentUser(updatedState, action);
  updatedState = users.groupUsersReducer(updatedState, action);

  updatedState = searchResultGlobalReducer(updatedState, action);
  updatedState = postsReducers.globalReducers(updatedState, action);
  updatedState = commentReducers.globalReducers(updatedState, action);
  updatedState = availableKudosReducers.globalReducers(updatedState, action);
  updatedState = catalogReducers.globalReducers(updatedState, action); 
  updatedState = fetchResource.deleteResourceReducer(updatedState, action);
  updatedState = dashboardGloballyScopedReducers(updatedState, action);
  updatedState = toursTakenReducers(updatedState, action);
  updatedState = kudosGivenReducers.globalReducers(updatedState, action);
  updatedState = categoryStatisticReducers.globalReducers(updatedState, action);

  return updatedState;
}

export default defaultAndCustomReducers;
