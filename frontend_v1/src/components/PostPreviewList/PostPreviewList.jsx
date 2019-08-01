import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-css';
import PostPreview from '../PostPreviews/PostPreview';

/*
PostPreviewList creates the grid for all the posts to live in
 -- Uses Container, Row, Col from reactstrap to set up the grid
 -- Uses Masonry to auto tile the grid based on sizing
*/
const PostPreviewList = ({posts}) => ( 

  <div className="o-post-preview-list" style={{"marginTop": "20px"}}>
    <Masonry
      breakpointCols={{default: 3, 991:2, 767: 1}}
      className="post-preview-masonry-grid row"
      columnClassName="col-sm-12 col-md-6 col-lg-4">
      {
        posts && posts.map(post => (
          <PostPreview post={post} key={post.id} />
        ))
      }
    </Masonry>
  </div>
)

PostPreviewList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
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
  ).isRequired
}

export default memo(PostPreviewList);