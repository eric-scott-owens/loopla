import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-css';
import UserPostPreview from '../PostPreviews/UserPostPreview/UserPostPreview';

/*
PostPreviewList creates the grid for all the posts to live in
 -- Uses Container, Row, Col from reactstrap to set up the grid
 -- Uses Masonry to auto tile the grid based on sizing
*/
const UserPostPreviewList = (props) => ( 

  <div className="o-post-preview-list">
    <Masonry
      breakpointCols={{default: 3, 991:2, 767: 1}}
      className="post-preview-masonry-grid row"
      columnClassName="col-sm-12 col-md-6 col-lg-4">
      {
        props.postIDs && props.postIDs.map(postID => (
          <UserPostPreview id={postID} key={postID} />
        ))
      }
    </Masonry>
  </div>
)

UserPostPreviewList.propTypes = {
  postIDs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
}

export default UserPostPreviewList;