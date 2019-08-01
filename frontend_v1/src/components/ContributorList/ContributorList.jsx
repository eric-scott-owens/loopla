import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import keys from 'lodash/keys';

import UserAvatar from '../UserAvatar';

import "./ContributorList.scss";

const ContributorList = (props) => {
  const { commenterIds, dontLinkToProfile, dontDisplayAvatar } = props;
  const thing = props.for;
  
  if(!commenterIds) return null;

  return (
    <div className="o-contributor-list">

      {/* add post author's Avatar */}
      {/* <UserAvatar id={thing.ownerId} dontLinkToProfile={dontLinkToProfile} className="o-post-author-avatar" /> */}
      
      {
        !dontDisplayAvatar && 
          commenterIds.map(userId => (
            <UserAvatar id={userId} key={userId} dontLinkToProfile={dontLinkToProfile} />
          ))
      }
      {/* {thing.comments.length === 0 && 
        <span className="o-contributor-count-zero">add comment</span>
      } */}
      {thing.comments.length >= 1 &&
        <span className={`o-contributor-count ${props.className}`}>
          <span className="o-contributor-count-number">{thing.comments.length}</span>&nbsp;{thing.comments.length === 1 ? 'comment' : 'comments' }
        </span>
      }
    </div>
  );
}

ContributorList.propTypes = {
  // eslint-disable-next-line
  for: PropTypes.shape({
    comments: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
  }).isRequired,
  dontLinkToProfile: PropTypes.bool
}

const mapStateToProps = (state, props) => {
  const { comments } = state;
  const thing = props.for;

  // collecting unique collections of Ids for the users who have commented
  const commenterIdHash = {};

  if(thing.comments) {
    thing.comments.forEach(commentId => {
      const comment = comments[commentId]; 
      if(comment && (comment.ownerId !== thing.ownerId)) {
        commenterIdHash[comment.ownerId] = true;
      }
    })
  }
  
  const commenterIds = keys(commenterIdHash).slice(0, 5);

  return { commenterIds };
}

export default connect(mapStateToProps)(ContributorList);