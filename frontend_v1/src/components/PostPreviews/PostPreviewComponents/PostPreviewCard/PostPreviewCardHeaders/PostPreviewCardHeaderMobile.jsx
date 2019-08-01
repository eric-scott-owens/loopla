import React from 'react';
import UserAvatar from '../../../../UserAvatar';

const PostPreviewCardHeaderMobile = (props) => (
  <div className="o-post-preview-mobile-card-header"> 
    <div className="o-avatar">
      <UserAvatar id={props.post.ownerId} dontLinkToProfile/>
    </div>
    <div className="o-post-preview-mobile-card-header-title-container">
      <h2 className="o-post-preview-mobile-card-header-title">
        {props.post.summary} 
      </h2>
    </div>
  </div>
)

export default PostPreviewCardHeaderMobile;