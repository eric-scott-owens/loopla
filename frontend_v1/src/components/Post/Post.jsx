import React from 'react';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Linkify from 'react-linkify';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import * as actions from '../../containers/posts/actions';
import * as kudosActions from '../../containers/kudos/giveKudos/actions';
import * as editingObjectActions from '../../actions/editingObjects';
import { setLastVisitedGroupId } from '../../containers/loops/actions';
import { isActiveMember } from '../../containers/loops/memberships/utilities';
import { isCommentDirty } from '../../containers/comments/utils';
import { getLoopDashboardUrl } from '../../utilities/UrlUtilities';
import { navigateTo, navigateBack, navigateBackTo } from '../../containers/history/AppNavigationHistoryService';
import { getReactElementsForSlateValue } from '../form-controls/RichTextField/SerializerUtilities';

import BasicButton from '../BasicButton/BasicButton';
import CategoryList from '../CategoryList';
import UserByLine from '../UserByLine';
import CommentList from '../CommentList';
import PhotoCollection from '../PhotoCollection';
import Place from '../Place';
import PostEditor from '../PostEditor';
import CommentEditor from '../CommentEditor';
import PageBackButton from '../PageBackButton';
import TextFinder, { scrollToFirstMarkedMatchOnPage } from '../TextFinder';
import GiveKudosDisplay from '../GiveKudosDisplay/GiveKudosDisplay';
import KudosReceived from '../KudosReceived';

import "./Post.scss";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPostEditing: props.isNewPost,
      isModalOpen: false,
      editingCommentId: null // new comment ID
    }

    this.newCommentId = newKeyFor(configuration.MODEL_TYPES.comment, { postId: props.Id });
  }

  componentDidMount() {
    if(`${this.props.id}`.indexOf(newKeyFor(configuration.MODEL_TYPES.post)) < 0) {
      this.props.dispatchFetchPost(this.props.id);
    }

    if(this.props.post) {
      this.props.dispatchSetLastVisitedGroupId(this.props.post.groupId);
    }
    
    scrollToFirstMarkedMatchOnPage();
  }

  shouldComponentUpdate(nextProps) {
    if(!this.props.areCommentsLoaded && nextProps.areCommentsLoaded) {
      scrollToFirstMarkedMatchOnPage();
    }

    if(!this.props.post && nextProps.post) {
      this.props.dispatchSetLastVisitedGroupId(nextProps.post.groupId);
    }

    return true;
  }

  onClickCategory = (categoryId) => {
    navigateTo(`${configuration.APP_ROOT_URL}/loop/${this.props.lastVisitedGroupId}/dashboard/?c=${categoryId}`);
  }

  onEdit = () => {
    const { post } = this.props;
    this.props.dispatchSetLastVisitedGroupId(post.groupId);
    this.props.dispatchStartEditing(post.id);
    this.setState({ editingCommentId: null, isPostEditing: true });
  }

  onCancelEdit = () => {
    const { postId } = this.props;
    this.setState({ editingCommentId: null, isPostEditing: false });

    if(postId === newKeyFor(configuration.MODEL_TYPES.post)) {
      const { lastVisitedGroupId } = this.props;
      if(lastVisitedGroupId) {
        navigateBackTo(getLoopDashboardUrl(lastVisitedGroupId));
      }
      else {
        navigateBack();
      }
    } 
  }

  setNewCommentAutoFormInstance = (autoFormInstance) => {
    this.newCommentAutoFormInstance = autoFormInstance;
  }

  editComment = (commentId) => {
    this.setState({ editingCommentId: commentId });
  }

  cancelEditComment = () => {
    this.setState({editingCommentId: null});
  }

  handleDelete = async (onSuccess, onError) => {
    try {
      const { post, dispatchRemoveEditingObject, dispatchDeletePost } = this.props;
      const postId = post.id;
      await dispatchDeletePost(post);
      dispatchRemoveEditingObject(postId);
      navigateBackTo(getLoopDashboardUrl(post.groupId));
    }
    catch(error) {
      onError(error);
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen
    }));
  }

  giveKudos = (selectedKudoId, kudosNote) => {
    const { post } = this.props;
    this.props.dispatchGiveKudos(post.model, post.id, selectedKudoId, kudosNote);
  }

  isNewCommentDirty = () => {
    if(this.newCommentAutoFormInstance) {
      const comment = this.newCommentAutoFormInstance.getEditingObject();
      return isCommentDirty(null, comment);
    }

    return false;
  }

  render() {
    const { 
      postId,
      post,
      canEdit,
      canDelete,
      isNewPost,
      isUserActiveLoopMember,
      areCommentsLoaded,
      searchContext
    } = this.props;

    const { isPostEditing, editingCommentId } = this.state
    const isNewCommentActivelyEditing = !isPostEditing && !editingCommentId && this.isNewCommentDirty();
    const isExistingCommentActivelyEditing = !isPostEditing && editingCommentId;

    let richTextElements;
    if (configuration.enableRichTextEditing && !isPostEditing && post) {
      richTextElements = getReactElementsForSlateValue(post.text);
    } 

    // Not editing, return the display post
    return (
      <div className={`o-post ${isPostEditing ? 'o-post-is-editing' : ''} ${isNewPost ? 'o-post-is-new' : ''}`}>
        <div className="o-post-card">

          {!isPostEditing && (
            /* Post editor already has it's own back button */
            <PageBackButton goBackToDashboard={!searchContext} state={{ postIdToScrollTo: postId }} />
          )}

          {isPostEditing ? (
            <PostEditor id={postId} onCancel={this.onCancelEdit} isActivelyEditing />
          ): (
            <div className={`o-post-view  ${isExistingCommentActivelyEditing || isNewCommentActivelyEditing ? 'o-editing-disabled' : '' }`}>
              {/* Post Content */}
              {(!post || !areCommentsLoaded) ? ('loading...') : (
                <React.Fragment>          
                  <div className="o-m-bottom-normal">
                    <h1>
                      <TextFinder>
                        {post.summary}
                      </TextFinder>
                    </h1>
                    <CategoryList categoryIds={post.allCategoryIds} onClick={this.onClickCategory} />
                  </div>

                  <UserByLine for={post} showUserAvatar dontShowLoop showMoreButton className="o-post-byline" onEdit={canEdit ? this.onEdit : undefined} handleDelete={canDelete ? this.handleDelete : undefined } post/>
                  
                  {/* {configuration.KUDOS_ENABLED && (
                    <React.Fragment>
                      <BasicButton onClick={this.toggleModal} color='primary'> KUDOS </BasicButton>
                      <KudosReceived for={post} />
                    </React.Fragment>
                  )} */}

                  {/*                       
                  <PageFullWidthSection>
                    <Toolbar side="right" className="">
                        <Kudos for={post} />
                    </Toolbar>
                  </PageFullWidthSection>
                      */}


                  {/* <Toolbar side="right" className="">
                    <div className="o-kudos-button-new">
                    <svg viewBox="0 0 100 100" x="0px" y="0px" width="25" height="25">
                      <path className="o-kudos-icon" d="M50.3813945,76.3543132 L29.5216278,87.3209415 C26.1038426,89.1177776 23.8617298,87.4927209 24.5150686,83.6834633 L28.4989295,60.4557718 L11.6230238,44.0058293 C8.85797745,41.3105753 9.71064723,38.6760291 13.5353592,38.1202659 L36.8572874,34.7313914 L47.2871707,13.5981395 C48.9960633,10.1355449 51.7651551,10.1323625 53.4756183,13.5981395 L63.9055016,34.7313914 L87.2274297,38.1202659 C91.0486298,38.6755188 91.9073528,41.3080981 89.1397652,44.0058293 L72.2638595,60.4557718 L76.2477204,83.6834633 C76.9004593,87.4892231 74.6620876,89.119429 71.2411611,87.3209415 L50.3813945,76.3543132 Z"></path>
                    </svg>
                    </div>
                  </Toolbar> */}

                  <div className="o-body-content">
                    <TextFinder>
                      <Linkify properties={{target:'_blank'}}>
                        {configuration.enableRichTextEditing ? richTextElements : post.text}
                      </Linkify>
                    </TextFinder>
                  </div>

                  {post.photoCollections.map(photoCollection => (
                    <PhotoCollection value={photoCollection} key={photoCollection.id} lightbox/>
                  ))}

                  {post.places.map(placeId => (
                    <div className="o-place-area" key={placeId}>
                      <Place id={placeId} noMap />
                    </div>
                  ))}

                </React.Fragment>
              )}
            </div>
          )}

          {post && (
            <React.Fragment>
              <CommentList 
                commentIds={post.comments} 
                disabled={isPostEditing || isNewCommentActivelyEditing} 
                editingCommentId={this.state.editingCommentId}
                editComment={this.editComment}
                cancelEditComment={this.cancelEditComment} />
    
              { isUserActiveLoopMember && !isNewPost && (
                <CommentEditor 
                  id={this.newCommentId} 
                  postId={post.id} 
                  disabled={isPostEditing || this.state.editingCommentId !== null}
                  autoFormInstance={this.setNewCommentAutoFormInstance}
                  cancelEditComment={this.cancelEditComment} />
              )}
            </React.Fragment>
          )}
        </div>

        {/* <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} className={`o-member-modal ${this.props.className}`}>
          <ModalHeader toggle={this.toggleModal}>Give Kudos</ModalHeader>
          <ModalBody>
             <GiveKudosDisplay onGiveKudos={this.giveKudos} onCancel={this.toggleModal}/>
          </ModalBody>
        </Modal> */}
      </div>
      
    );
  }
} 

Post.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  searchContext: PropTypes.shape({
    textQuery: PropTypes.string,
    tagQuery: PropTypes.string,
    placeIdQuery: PropTypes.string
  })
};


const mapStateToProps = (state, props) => {
  let { post } = props;
  if(!post) {
    if(props.id) post = state.posts[props.id];
    else throw new Error("CRITICAL: Cannot load post. An id must be provided");
  }

  const postId = post ? post.id : props.id;
  const { currentUserId, lastVisitedGroupId } = state;
  const isUserActiveLoopMember = isActiveMember(state, currentUserId, post ? post.groupId : '');
  const canEdit = ( post && post.ownerId === currentUserId && isUserActiveLoopMember );
  const canDelete = ( post && post.ownerId === currentUserId && post.comments.length < 1 && isUserActiveLoopMember );
  const isNewPost = (postId === newKeyFor(configuration.MODEL_TYPES.post));
  
  // Figure out if the comments are loaded yet. If not, we don't want to display just yet
  let areCommentsLoaded = !!post;
  if(post) {
    forEach(post.comments, commentId => {
      areCommentsLoaded = !!state.comments[commentId];
      return areCommentsLoaded;
    });
  }

  return { 
    postId,
    post,
    currentUserId,
    canEdit,
    canDelete,
    isUserActiveLoopMember,
    lastVisitedGroupId,
    isNewPost,
    areCommentsLoaded
  };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchPost: (id) => dispatch(actions.batchFetchPosts([id])),
  dispatchDeletePost: (post) => dispatch(actions.deletePost(post)),
  dispatchSetLastVisitedGroupId: (groupId) => dispatch(setLastVisitedGroupId(groupId)),
  dispatchRemoveEditingObject: (postId) => dispatch(editingObjectActions.removeEditingObject(postId)),
  dispatchStartEditing: (postId) => dispatch(editingObjectActions.startEditing(postId)),
  dispatchStopEditing: (postId) => dispatch(editingObjectActions.stopEditing(postId)),
  dispatchStopEditingAllComments: () => dispatch(editingObjectActions.stopEditingAllComments()),
  dispatchGiveKudos: (contentType, objectId, selectedKudoId, kudosNote) => dispatch(kudosActions.giveKudos(contentType, objectId, selectedKudoId, kudosNote)), 
})

export default connect(mapStateToProps, mapDispatchToProps)(Post);