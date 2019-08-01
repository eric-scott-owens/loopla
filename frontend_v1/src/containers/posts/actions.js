import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import { createAction } from 'redux-actions';
import { encodePhotoCollectionPhotos, imprintPhotoCollectionOrderingIndexes } from '../photos/PhotoUtilities';
import * as fetchResourceActions from '../../actions/fetchResource';
import configuration from '../../configuration';
import { fetch } from '../../actions/fetch';
import { addPostToDashboardReferences, removePostFromDashboardReferences } from '../dashboard/actions';
import { fromServerPostObject } from './mappers';


export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-POSTS',
    set: 'SET-POSTS'
  },
  single: {
    fetch: 'FETCH-POST',
    set: 'SET-POST',
    remove: 'REMOVE-POST'
  },
  batch: {
    fetch: 'BATCH-FETCH-POSTS',
    set: 'BATCH-SET-POST-DATA'
  },

  create: 'CREATE-POST',
  update: 'UPDATE-POST',
  setPostCountForUser: 'SET-POST-COUNT-FOR-USER',
  setPostCountForGroup: 'SET-POST-COUNT-FOR-GROUP',
  reset: 'RESET-POSTS'
};

export const removePost = createAction(ACTION_TYPES.single.remove);

export const setPost = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});

export const setPostCountForUser = (userId, groupId, payload) => ({
  type: ACTION_TYPES.setPostCountForUser,
  userId,
  groupId,
  payload,
});

export const setPostCountForGroup = (id, payload) => ({
  type: ACTION_TYPES.setPostCountForGroup,
  id,
  payload,
});

export const setPosts = createAction(ACTION_TYPES.all.set);

export const resetPosts = createAction(ACTION_TYPES.reset);

export const fetchPost = id => async dispatch => {
  try {
    const post = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.post, id));
    dispatch(setPost(id, post));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

const batchSetPostDefaultConfig = {
  posts: [],
  cachedPosts: [],
  comments: [],
  cachedComments: [],
  users: [],
  cachedUsers: [],
  tags: [],
  cachedTags: [],
  places: [],
  cachedPlaces: [],
  groups: [],
  cachedGroups: [],
  kudosGiven: [],
  cachedKudosGiven: []
};
export const batchSetPostData = (config) => ({
  type: ACTION_TYPES.batch.set,
  ...batchSetPostDefaultConfig,
  ...config
});

const defaultChildrenToBatchLoad = {
  comments: true,
  users: true,
  tags: true,
  places: true,
  groups: true,
  kudosGiven: true
}

/**
 * 
 * @param {*} ids 
 * @param {*} childrenToBatchLoad 
 */
export const batchFetchPosts = (ids, childrenToBatchLoad) => dispatch => {
  const batchPromise = new Promise((resolve, reject) => {
    
    const postIds = ids.slice(0);
    const postsPromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.post, postIds));
    postsPromise.then((postResults) => {
      const config = { ...defaultChildrenToBatchLoad, ...(childrenToBatchLoad || {}) };
      const posts = postResults.loaded;
      const cachedPosts = postResults.cached;

      // Get the other stuff we need to batch load
      const commentIds = [];
      const userIdHash = {};
      const tagIdHash = {};
      const placeIdHash = {};
      const groupIdHash = {};
      const kudosGivenIdHash = {};
      
      if(config.comments || config.users || config.tags || config.places || config.groups || config.kudosGiven) {
        const actions = [];
        // Figure out the actions to run given the provided configuration
        if(config.comments) { actions.push((post) => { forEach(post.comments, id => { commentIds.push(id ); }); }); }
        if(config.groups) { actions.push((post) => { groupIdHash[post.groupId] = true; }); }
        if(config.users) { actions.push((post) => { userIdHash[post.ownerId] = true; }); }
        if(config.tags) { actions.push((post) => { forEach(post.tags, id => { tagIdHash[id] = true; }); }); }
        if(config.places) { actions.push((post) => { forEach(post.places, id => { placeIdHash[id] = true; }); }); }
        if(config.kudosGiven) { actions.push((post) => { forEach(post.kudosReceived, id => { kudosGivenIdHash[id] = true; }); }); }

        // Run the actions for each post
        forEach(posts, post => {
          forEach(actions, action => action(post));
        });

        // Run the actions for each cached post.. in case we have partial loads in the past that need filled in
        forEach(cachedPosts, post => {
          forEach(actions, action => action(post));
        });
      }

      // Load all the comments
      let commentsPromise;
      if(config.comments) {
        // If we are loading comments, request them 
        commentsPromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.comment, commentIds));
      }
      else {
        // Otherwise, pretend to get them and return an empty array
        commentsPromise = new Promise(myResolver => { myResolver({ loaded: [], cached: [] }); }); 
      }

      commentsPromise.then((commentResults) => {
        const comments = commentResults.loaded;
        const cachedComments = commentResults.cached;

        if(config.comments) {
          // The the comment stuff we need to batch load as well
          // Figure out which actions to run given the current configuration
          const actions = [];
          if(config.users) { actions.push((comment) => { userIdHash[comment.ownerId] = true; }); }
          if(config.tags) { actions.push((comment) => { forEach(comment.tags, id => { tagIdHash[id] = true; }); }); }
          if(config.places) { actions.push((comment) => { forEach(comment.places, id => { placeIdHash[id] = true; }); }); }
          if(config.kudosGiven) { actions.push((comment) => { forEach(comment.kudosGiven, id => { kudosGivenIdHash[id] = true; }); }); }
          
          // Run the actions for each comment
          forEach(comments, comment => {
            forEach(actions, action => action(comment));
          });

          // Run the actions for each cached comment.. in case we have partial loads in the past that need filled in
          forEach(cachedComments, comment => {
            forEach(actions, action => action(comment));
          });
        }

        // Get users - if configured
        let usersPromise;
        if(config.users) {
          const userIds = keys(userIdHash);
          usersPromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.user, userIds));
        } else {
          usersPromise = new Promise(myResolver => { myResolver({ loaded: [], cached: [] }); });
        }
        
        // Get tags - if configured
        let tagsPromise;
        if(config.tags) {
          const tagIds = keys(tagIdHash);
          tagsPromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.tag, tagIds));
        } else {
          tagsPromise = new Promise(myResolver => { myResolver({ loaded: [], cached: [] }); });
        }
        
        // Get places - if configured
        let placesPromise;
        if(config.places) {
          const placeIds = keys(placeIdHash);
          placesPromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.place, placeIds));
        } else {
          placesPromise = new Promise(myResolver => { myResolver({ loaded: [], cached: [] }); });
        }
        
        // Get groups - if configured
        let groupsPromise;
        if(config.groups) {
          const groupIds = keys(groupIdHash);
          groupsPromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.group, groupIds));
        } else {
          groupsPromise = new Promise(myResolver => { myResolver({ loaded: [], cached: [] }); });
        }
        
        // Get kudos given - if configured
        let kudosGivenPromise;
        if(config.kudosGiven) {
          const kudosGivenIds = keys(kudosGivenIdHash);
          kudosGivenPromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.kudosGiven, kudosGivenIds));
        } else { 
          kudosGivenPromise = new Promise(myResolver => { myResolver({ loaded: [], cached: [] }); });
        }


        // When all child batch load promises are complete
        Promise.all([usersPromise, tagsPromise, placesPromise, groupsPromise, kudosGivenPromise]).then((values) => {
          // Extract the values
          const users = values[0].loaded;
          const cachedUsers = values[0].cached;
          const tags = values[1].loaded;
          const cachedTags = values[1].cached;
          const places = values[2].loaded;
          const cachedPlaces = values[2].cached;
          const groups = values[3].loaded;
          const cachedGroups = values[3].cached;
          const kudosGiven = values[4].loaded;
          const cachedKudosGiven = values[4].cached;

          // And batch load them into Redux
          // We really do want to do this even if everything is cached...
          // because this is where we get our chance to update post.allTags if it hasn't been possible before
          if(
            posts.length > 0 || comments.length > 0 || users.length > 0 || tags.length > 0 || places.length > 0 || groups.length > 0 || kudosGiven.length > 0 ||
            cachedPosts.length > 0 || cachedComments.length > 0 || cachedUsers.length > 0 || cachedTags.length > 0 || cachedPlaces.length > 0 || cachedGroups.length > 0 || cachedKudosGiven.length > 0
          ) {
            dispatch(batchSetPostData({posts, cachedPosts, comments, cachedComments, users, cachedUsers, tags, cachedTags, places, cachedPlaces, groups, cachedGroups, kudosGiven, cachedKudosGiven }));
          }

          // Jobs done. Resolve with the resulting data
          resolve({
            posts, 
            comments,
            users,
            tags,
            places,
            groups,
            kudosGiven
          });
        }).catch((error) => {
          reject(error);
        })
      }).catch((error) => { 
        reject(error); 
      });
    }).catch((error) => {
      reject(error);
    });
  });
  
  return batchPromise;
}

export const createPost = (post) => async dispatch => {
  try {
    const encodedPhotoCollections = await encodePhotoCollectionPhotos(post.photoCollections);
    const processedPhotoCollections = imprintPhotoCollectionOrderingIndexes(encodedPhotoCollections);
    const processedPost = { ...post, photoCollections: processedPhotoCollections };

    const postedPost = await dispatch(fetchResourceActions.post(configuration.MODEL_TYPES.post, processedPost));
    dispatch(setPost(postedPost.id, postedPost));
    dispatch(addPostToDashboardReferences(postedPost));
  } catch(error) {
    // TODO: error handling here
  }
}

export const updatePost = post => async dispatch => {
  try {
    const encodedPhotoCollections = await encodePhotoCollectionPhotos(post.photoCollections);
    const processedPhotoCollections = imprintPhotoCollectionOrderingIndexes(encodedPhotoCollections);
    const processedPost = { ...post, photoCollections: processedPhotoCollections };
    
    const postedPost = await dispatch(fetchResourceActions.patch(configuration.MODEL_TYPES.post, processedPost));
    dispatch(setPost(postedPost.id, postedPost));
    dispatch(addPostToDashboardReferences(postedPost));
  } catch(error) {
    // TODO: error handling here
  }
}

export const deletePost = (post) => async dispatch => {
  try {
    await dispatch(fetchResourceActions.deleteResource(configuration.MODEL_TYPES.post, post.id));
    dispatch(removePost(post));
    dispatch(removePostFromDashboardReferences(post));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  } 
}



export const fetchPostCountForUser = (userId, groupId) => async dispatch => {
  try{
    const numPosts = await dispatch(fetch(`${configuration.API_ROOT_URL}/post-count/?userId=${userId}&groupId=${groupId}`, {method: 'GET'}));
    dispatch(setPostCountForUser(userId, groupId, numPosts));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchPostCountForGroup = groupId => async dispatch => {
  try{
    const numPosts = await dispatch(fetch(`${configuration.API_ROOT_URL}/post-count/?groupId=${groupId}`, {method: 'GET'}));
    dispatch(setPostCountForGroup(groupId, numPosts));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}