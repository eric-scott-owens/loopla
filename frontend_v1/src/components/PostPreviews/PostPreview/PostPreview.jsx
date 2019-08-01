import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import TextTruncate from 'react-text-truncate'; 
import configuration from '../../../configuration';
import PostPreviewParent from './PostPreviewParent';

import './PostPreview.scss';

export function getPostPreviewDomId(postId) {
  return `post-preview-${postId}`;
}

const PostPreview = (props) => {
  const { post } = props;
  const postId =  props.id;

  // Show post preview
  return (
    <div className="o-post-preview">
      <Link to={`${configuration.APP_ROOT_URL}/posts/${post.id}`} id={getPostPreviewDomId(postId)} >
        <PostPreviewParent post={post} id={post.id} key={post.id}/>
      </Link>
    </div>
  );
}


PostPreview.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    summary: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    places: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    photoCollections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      objectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      orderingIndex: PropTypes.number,
      photoCollectionPhotos: PropTypes.arrayOf(PropTypes.shape({}))
    })),
    comments: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  })
};

export default PostPreview;