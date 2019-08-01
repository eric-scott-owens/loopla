import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Linkify from 'react-linkify';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import * as actions from '../../containers/comments/actions';
import { isActiveMember } from '../../containers/loops/memberships/utilities';
import BasicButton from '../BasicButton/BasicButton';
import * as kudosActions from '../../containers/kudos/giveKudos/actions';

import UserByLine from '../UserByLine';
import Place from '../Place';
import PhotoCollection from '../PhotoCollection';
import CommentEditor from '../CommentEditor';
import TextFinder from '../TextFinder';
import { getReactElementsForSlateValue } from '../form-controls/RichTextField/SerializerUtilities';
import GiveKudosDisplay from '../GiveKudosDisplay/GiveKudosDisplay';
import KudosReceived from '../KudosReceived';

import "./Comment.scss";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    }
  }

  componentDidMount() {
    if(
      !this.props.comment &&
      (
        this.props.id 
        && `${this.props.id}`.indexOf(newKeyFor(configuration.MODEL_TYPES.comment)) < 0
      )
    ) {
      this.props.dispatchFetchComment(this.props.id);
    }
  }

  onEdit = () => {
    if(this.props.editComment) {
      const { commentId } = this.props;
      this.props.editComment(commentId);
    }
  }

  handleDelete = async (onSuccess, onError) => {
    try {
      const { comment, dispatchDeleteComment } = this.props;
      await dispatchDeleteComment(comment);
    }
    catch(error) {
      if(onError) {
        onError(error);
      }
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen
    }));
  }

  giveKudos = (selectedKudoId, kudosNote) => {
    const { comment } = this.props;
    this.props.dispatchGiveKudos(comment.model, comment.id, selectedKudoId, kudosNote);
  }

  render() {
    const { comment, commentId, canEdit, canDelete, isEditing, disabled, cancelEditComment } = this.props;

    if(isEditing) return (
      <CommentEditor 
        id={commentId} 
        postId={comment.postId} 
        disabled={disabled}
        cancelEditComment={cancelEditComment}  />
    )

    if(!comment) return 'loading...';

    let richTextElements;
    if(configuration.enableRichTextEditing && !isEditing && comment) {
      richTextElements = getReactElementsForSlateValue(comment.text);
    }

    return (
      <div className={`o-comment ${disabled ? 'o-editing-disabled' : '' }`}>

        <div className="o-comment-divider" />

        <UserByLine for={comment} showUserAvatar showMoreButton onEdit={canEdit ? this.onEdit : undefined} handleDelete={canDelete ? this.handleDelete : undefined } />
        {/* {configuration.KUDOS_ENABLED && (
          <React.Fragment>
            <BasicButton onClick={this.toggleModal} color='primary'> KUDOS </BasicButton>
            <KudosReceived for={comment} />
          </React.Fragment>
        )} */}

        <div className="o-body-content">
          <TextFinder>
            <Linkify properties={{target:'_blank'}}>
              {configuration.enableRichTextEditing ? richTextElements : comment.text}
            </Linkify>
          </TextFinder>
        </div>

        {comment.photoCollections.map(photoCollection => (
          <PhotoCollection value={photoCollection} key={photoCollection.id} lightbox/>
        ))}
          
        {comment.places.map(placeId => (
          <div className="o-place-area" key={placeId}>
            <Place id={placeId} noMap />
          </div>
        ))}

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

Comment.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  editComment: PropTypes.func,
  cancelEditComment: PropTypes.func
}

const mapStateToProps = (state, props) => {
  let comment;
  if(props.id) comment = state.comments[props.id];
  else throw new Error("CRITICAL: Cannot load comment. An id was not provided");

  const { currentUserId } = state;
  const post = comment ? state.posts[comment.postId] : null;
  const isUserActiveLoopMember = isActiveMember(state, currentUserId, post ? post.groupId : null);
  const canEdit = ( comment && comment.ownerId === currentUserId && isUserActiveLoopMember );
  const canDelete = ( comment && comment.ownerId === currentUserId && isUserActiveLoopMember );

  const commentId = props.id;

  // Figure out if we are disabled
  let { disabled } = props;
  if(!props.isEditing && !disabled) {
    if(commentId === newKeyFor(configuration.MODEL_TYPES.comment, { postId: comment ? comment.postId : '' })) {
      disabled = false;
    }
  }

  return { comment, commentId, canEdit, canDelete, disabled };
};

const mapDispatchToProps = dispatch => ({
  dispatchFetchComment: id => dispatch(actions.fetchComment(id)),
  dispatchDeleteComment: comment => dispatch(actions.deleteComment(comment)),
  dispatchGiveKudos: (contentType, objectId, selectedKudoId, kudosNote) => dispatch(kudosActions.giveKudos(contentType, objectId, selectedKudoId, kudosNote))
});

export default connect(mapStateToProps, mapDispatchToProps)(Comment);

