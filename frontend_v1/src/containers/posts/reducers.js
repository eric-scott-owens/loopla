import { handleActions } from 'redux-actions';
import forEach from 'lodash/forEach';
import uniq from 'lodash/uniq';

import * as actions from './actions';
import { process as processComment } from '../comments/reducers';
import { process as processUser } from '../users/reducers';
import { process as processTag } from '../tags/reducers';
import { process as processPlace } from '../places/reducers';
import { process as processGroup } from '../loops/reducers';
import { process as processKudosGiven } from '../kudos/kudosGiven/reducers';

export function process(state, post) {
  const posts = {...state.posts};
  posts[post.id] = post;

  let updatedState = {
    ...state,
    posts
  };

  forEach(post.comments, comment => { updatedState = processComment(updatedState, comment); });
  return updatedState;
}

export const globalReducers = handleActions({
    [actions.ACTION_TYPES.single.set]: (state, action) => process(state, action.payload),
    [actions.ACTION_TYPES.reset]: (state, action) => {
      let posts = Object.assign({}, state.posts);
      posts = {};
      const updatedState = {
        ...state,
        posts
      };
    
      return updatedState;
    },
    [actions.ACTION_TYPES.all.set]: (state, action) => {
      let updatedState = Object.assign({}, state);
      forEach(action.payload, post => { updatedState = process(updatedState, post); });
      return updatedState;
    },
    [actions.ACTION_TYPES.batch.set]: (state, action) => {
      const { posts, cachedPosts, comments, users, tags, places, groups, kudosGiven } = action;
      let updatedState = {...state};
      
      forEach(posts, post => {
        updatedState = process(updatedState, post);
      });
        
      forEach(comments, comment => {
        updatedState = processComment(updatedState, comment);
      });

      forEach(users, user => {
        updatedState.users = processUser(updatedState.users, user);
      });
      
      forEach(tags, tag => {
        updatedState.tags = processTag(updatedState.tags, tag);
      });

      forEach(places, place => {
        updatedState.places = processPlace(updatedState.places, place);
      });

      forEach(groups, group => {
        updatedState.groups = processGroup(updatedState.groups, group);
      });

      forEach(kudosGiven, kg => {
        updatedState.kudosGiven = processKudosGiven(updatedState.kudosGiven, kg);
      });

      // Calculate all tags for each post
      // We need to include the cached ones so that if we are batch loading a post that previously
      // had a partial load, we can update the allTags with the now loaded comments.
      const allPostIds = posts.map(post => post.id);
      forEach(cachedPosts, cachedPost => { allPostIds.push(cachedPost.id) });

      // Force detection of a new posts state
      let hasForcedNewPostsState = false;
      forEach(allPostIds, id => {
        const mappedPost = updatedState.posts[id];
        let allTags = mappedPost.tags.slice(0);
        forEach(mappedPost.comments, commentId => {
          const comment = updatedState.comments[commentId];
          if(comment) {
            // If we've only done a partial load we may not have the comments yet
            allTags.splice(allTags.length, 0, ...comment.tags);
          }
        });

        // So... if we've had a partial load... this could be very incomplete
        // This is currently fine because we only display allTags on the
        // Post.jsx page which does a full batch load.
        allTags = uniq(allTags);

        if(!mappedPost.allTags || mappedPost.allTags.length !== allTags.length) {
          if(!hasForcedNewPostsState) {
            // We want to make sure the posts dictionary triggers updates
            hasForcedNewPostsState = true;
            updatedState.posts = {...updatedState.posts};
          }
          
          // We need to make sure the individual post object triggers updates
          const updatedPost = {...mappedPost}
          updatedPost.allTags = allTags;
          updatedState.posts[updatedPost.id] = updatedPost;
        }
      });

      return updatedState;
    },
    [actions.ACTION_TYPES.single.remove]: (state, action) => {
      const post = action.payload;
      const updatedState = {...state};
      const updatedPosts = {...updatedState.posts};
      
      delete updatedPosts[post.id];
      updatedState.posts = updatedPosts;
      
      if(post.commentIds.length > 0) {
        const updatedComments = {...updatedState.comments};
        forEach(post.commentIds, commentId => {
          delete updatedComments[commentId];
        });

        updatedState.comments = updatedComments;
      }

      return updatedState;
    }
  },
  // Initializer
  {}
);

export const initializePosts = handleActions({}, {});

export const postCountByGroupReducer = handleActions({
  [actions.ACTION_TYPES.setPostCountForGroup]: (state, action) => {
    const numPosts = action.payload;
    const groupId = action.id;
    const newPostCountByGroup = {...state};
    newPostCountByGroup[groupId] = numPosts;
    return newPostCountByGroup;
  }

},
// Initial State
{});


export const postCountByUserReducer = handleActions({
  [actions.ACTION_TYPES.setPostCountForUser]: (state, action) => {
    const numPosts = action.payload;
    const { userId, groupId } = action;
    const updatedState  = {...state};
    updatedState[userId] = {...(updatedState[userId] || {})};
    updatedState[userId][groupId] = numPosts;

    return updatedState;
  }

},
// Initial State 
{});
