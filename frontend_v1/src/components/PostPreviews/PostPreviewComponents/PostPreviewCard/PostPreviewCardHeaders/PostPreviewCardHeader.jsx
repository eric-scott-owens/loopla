import React from 'react';

const PostPreviewCardHeader = (props) => (
  <div className="o-card-header"> 
    <h2 className="o-card-title">
      {props.post.summary} 
    </h2>
  </div>
)

export default PostPreviewCardHeader;