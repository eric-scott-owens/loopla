import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextTruncate from 'react-text-truncate'; 
import Plain from 'slate-plain-serializer';

import configuration from '../../../configuration';
import { addPostToUsersLoadedData } from '../../../containers/users/actions';
import Card from '../../Card';
import UserByLine from '../../UserByLine';
import Place from '../../Place';
import ContributorList from '../../ContributorList';
import PhotoCollection from '../../PhotoCollection';

import '../PostPreview';
import './UserPostPreview.scss';

export function getPostPreviewDomId(postId) {
  return `user-post-preview-${postId}`;
}

class UserPostPreview extends React.Component {

  componentDidMount() {
    if(this.props.post && !this.props.userStateCachedPost) {
      this.props.dispatchAddPostToUsersLoadedData(this.props.post);
    }
  }

  shouldComponentUpdate(nextProps) {
    if(!!nextProps.post && !nextProps.userStateCachedPost) {
      this.props.dispatchAddPostToUsersLoadedData(nextProps.post);
      return false; // no need to render until we have the post in the dashboard's loaded data
    }

    return true;
  }

  render() {
    const { userStateCachedPost } =this.props;
    const postId = this.props.id;

    if (!userStateCachedPost) {
      // Show loading card
      return (
        <Link 
          to={`${configuration.APP_ROOT_URL}/posts/${postId}`} 
          className="o-post-preview"
          id={getPostPreviewDomId(postId)}>
          <Card id={postId} key={postId}>
            Loading...
          </Card>
        </Link>
      );
    }

    // Show post preview
    return (
      <div className="o-post-preview">
        <Card id={userStateCachedPost.id} key={userStateCachedPost.id}>
          
          <Link to={`${configuration.APP_ROOT_URL}/posts/${userStateCachedPost.id}`} >
            <div className="o-card-header"> 
              <h2 className="o-card-title">
                {userStateCachedPost.summary} 
              </h2>
            </div>
          </Link>
          
          <UserByLine for={userStateCachedPost} dontShowLoop />
          
          <div className="o-truncate-text">
            <TextTruncate 
              line={12} 
              truncateText="..."
              text={configuration.enableRichTextEditing ? Plain.serialize(userStateCachedPost.text) : userStateCachedPost.text}
              // textTruncateChild={<div className="o-truncate-text-helper">read more&nbsp;&#10140;&nbsp;</div>}
              />
          </div>
          
          {userStateCachedPost.places.map(placeId => (
            <div className="o-place-area" key={placeId}>
              <Place id={placeId} noMap noAddress noPhone noWebsite/>
            </div>
          ))}

          {userStateCachedPost.photoCollections.map(photoCollection => (
            <PhotoCollection value={photoCollection} key={photoCollection.id}/>
          ))}

          {userStateCachedPost.comments.length >= 1 && 
            <Link to={`${configuration.APP_ROOT_URL}/posts/${userStateCachedPost.id}`}>
              <div className="">
                <ContributorList for={userStateCachedPost} dontLinkToProfile />
              </div>
            </Link>
          }
 
          <Link to={`${configuration.APP_ROOT_URL}/posts/${userStateCachedPost.id}`}>
            <div className="o-post-preview-cta">
              <span className="o-post-preview-cta-text">add comment</span>
            </div>
          </Link>
 
          {/* <Link to={`${configuration.APP_ROOT_URL}/posts/${userStateCachedPost.id}`} >
            <ContributorList for={userStateCachedPost} dontLinkToProfile />
          </Link> */}
          
        {/* <Kudos for={post} disabled /> */}
        </Card>
      </div>
    );
  }
}

UserPostPreview.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const mapStateToProps = (state, props) => {
  const post = state.posts[props.id];
  let userStateCachedPost;
  if(post) {
    const userState = state.userStates[post.ownerId];
    userStateCachedPost = userState.loadedData[post.id];
  }
  

  return { post, userStateCachedPost };
}

const mapDispatchToProps = dispatch => ({
  dispatchAddPostToUsersLoadedData: (post) => dispatch(addPostToUsersLoadedData(post))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPostPreview);