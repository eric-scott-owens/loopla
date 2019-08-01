import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Place from '@material-ui/icons/Place';
import get from 'lodash/get';

import configuration from '../../configuration';
import { getBlankModelFor, isObjectNew as isCommentNew } from '../../utilities/ObjectUtilities';
import { scrollToBottomOfPage } from '../../utilities/StyleUtilities';
import * as actions from '../../containers/comments/actions';
import * as editingActions from '../../actions/editingObjects';
import { isNewCommentId, isCommentDirty } from '../../containers/comments/utils';

import AutoForm from '../AutoForm';
import RichTextField from '../form-controls/RichTextField';
import PlaceField from '../form-controls/PlaceField';
import TagField from '../form-controls/TagField';
import CategoryField from '../form-controls/CategoryField';
import PhotoGalleryBuilder from '../form-controls/PhotoGalleryBuilder';
import PageFullWidthSection from '../PageFullWidthSection';
import UserAvatar from '../UserAvatar';
import UserByLine from '../UserByLine';
import IconButton from '../IconButton';
import Toolbar from '../Toolbar';
import { ProcessButton, CancelButton } from '../AutoForm/AutoFormToolbar';
import CommentValidator from '../../containers/comments/validator';
import { getPlainTextForSlateValue } from '../form-controls/RichTextField/SerializerUtilities';
import TextArea from '../form-controls/TextArea';

// AutoForm PrepareChildrenPlugins
import AutoTrimTextPlugin from '../AutoForm/PrepareChildrenPlugins/AutoTrimTextPlugin';
import CategoryManagerPlugin from '../../containers/categories/autoFormPlugins/prepareChildrenPlugins/CategoryManagerPlugin';
import PlaceManagerPlugin from '../../containers/places/autoFormPlugins/prepeareChildrenPlugins/PlaceManagerPlugin';
import ProvidesSuggestedMetadataPlugin from '../../containers/tags/autoFormPlugins/prepareChildrenPlugins/ProvideSuggestedMetadataPlugin';
import TagManagerPlugin from '../../containers/tags/autoFormPlugins/prepareChildrenPlugins/TagManagerPlugin';

import "./CommentEditor.scss";
import { RETRY_USER_UI_INTERACTION_COMMAND_DELAY } from '../AutoForm/AutoForm';


const validator = new CommentValidator();

const isTargetPlacesAutoComplete = (target) => {
  if(target.classList.contains('pac-container')) return true;

  const dropdown = target.closest('.pac-container');
  return !!dropdown;
};

class CommentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.abortClose = false; // used by PhotoGallery to block closing the comment while picking images
    this.state = { 
      isCommentOpen: !isNewCommentId(props.id), // Start the editor open if the comment isn't new
      isPhotosSectionOpen: (get(props, 'comment.photoCollections[0].photoCollectionPhotos.length', 0) > 0),
      isPlacesSectionOpen: (get(props, 'comment.places.length', 0) > 0),
      resetForm: false
    };
    this.blocks = {
      text: false,
      places: false,
      placesAutoComplete: false,
      tags: false,
      photos: false,
      mouseEnter: false
    }
    this.prepareChildrenPlugins = [
      new AutoTrimTextPlugin(),
      new CategoryManagerPlugin(),
      new PlaceManagerPlugin(),
      new ProvidesSuggestedMetadataPlugin(),
      new TagManagerPlugin()
    ];

    this.ref = null;
  }

  componentDidMount() {
    this.ref.addEventListener("mouseover", this.blockCloseByMouseEnter);
    this.ref.addEventListener("mouseleave", this.unblockCloseByMouseLeave);
    document.addEventListener("click", this.blockCloseByPlacesAutoCompleteClick);
    document.addEventListener("touchstart", this.blockCloseByPlacesAutoCompleteClick);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!this.state.resetForm && nextState.resetForm) {
      setTimeout(() => {
        this.setState({ resetForm: false });
      }, 10);
    }

    return true;
  }

  componentWillUnmount() {
    this.ref.removeEventListener("mouseover", this.blockCloseByMouseEnter);
    this.ref.removeEventListener("mouseleave", this.unblockCloseByMouseLeave);
    document.removeEventListener("click", this.blockCloseByPlacesAutoCompleteClick);
    document.removeEventListener("touchstart", this.blockCloseByPlacesAutoCompleteClick);
  }

  onCancelEditComment = () => {
    if(this.props.cancelEditComment) { 
      this.props.cancelEditComment(this.props.id);
    }

    if(this.props.isNewComment) {
      this.onResetForm();
    }
  }

  onProcessingComplete = () => {
    if(this.props.isNewComment) {
      this.onResetForm({ reinitializeForm: true });
    }

    if(this.props.cancelEditComment) { 
      this.props.cancelEditComment(this.props.id);
    }
  }

  onResetForm = ({reinitializeForm}) => {
    
    this.resetCloseBlocks();
    setTimeout(this.closeComment, 50);
    
    setTimeout(() => {
      this.setState({ resetForm: true });
      
      if(reinitializeForm) {
        this.autoFormInstance.reinitializeForm();
      }
    }, 50);
  }

  getProcessingButtonText = (comment, props, isProcessing) => {
    if(isCommentNew(comment)) {
      return isProcessing ? 'Commenting...' : 'Comment';
    }

    return isProcessing ? 'Saving...' : 'Save';
  }

  setAutoFormInstance = (autoFormInstance) => {
    this.autoFormInstance = autoFormInstance;
    if(this.props.autoFormInstance) {
      this.props.autoFormInstance(autoFormInstance);
    }
  }

  resetCloseBlocks = () => {
    this.setState({ 
      isCommentOpen: !isNewCommentId(this.props.id), // Start the editor open if the comment isn't new
      isPhotosSectionOpen: false,
      isPlacesSectionOpen: false
    });
    this.blocks = {
      text: false,
      places: false,
      placesAutoComplete: false,
      tags: false,
      photos: false
    }
  }

  isCloseBlocked = () => {
    
    const editingObject = this.autoFormInstance.getEditingObject();
    if(!editingObject) return false; 
    
    const blockedByActiveField = (
      this.blocks.text
      || this.blocks.places
      || this.blocks.placesAutoComplete
      || this.blocks.tags
      || this.blocks.categories
      || this.blocks.photos
      || this.blocks.mouseEnter
    );
    const text = configuration.enableRichTextEditing ? getPlainTextForSlateValue(editingObject.text) : editingObject.text;
    const blockedByPopulatedField = (
      (text && text !== '')
      || editingObject.places.length > 0
      || editingObject.tags.length > 0
      || (editingObject.photoCollections.length > 0 && editingObject.photoCollections[0].photoCollectionPhotos.length > 0)
    )

    return blockedByActiveField || blockedByPopulatedField;
  }

  openComment = () => {
    // Only allow the comment box to open if this comment is the one
    // currently being edited and has not been disabled
    if(!this.props.disabled) {
      this.setState((state) => {
        if(!state.isCommentOpen) {
          setTimeout(() => {
            scrollToBottomOfPage();
          }, 200);
        }
        
        return { isCommentOpen: true }
      });
      
    }
  }

  closeComment = () => {
    if(!this.isCloseBlocked()) {
      this.setState({ isCommentOpen: false });
    }
  }

  blockCloseBy = (fieldName) => {
    this.blocks[fieldName] = true;
    setTimeout(() => {
      this.openComment();
    }, 10);
  }
  
  blockCloseByText = () => {
    this.blockCloseBy('text');
  }

  blockCloseByPlaces = () => {
    this.blockCloseBy('places');
  }

  blockCloseByTags = () => {
    this.blockCloseBy('tags');
  }

  blockCloseByCategories = () => {
    this.blockCloseBy('categories');
  }

  blockCloseByPhotos = () => {
    this.blockCloseBy('photos');
  }

  blockCloseByMouseEnter = () => {
    this.blockCloseBy('mouseEnter');
  }

  blockCloseByPlacesAutoCompleteClick = (event) => {
    if(isTargetPlacesAutoComplete(event.target)) {
      this.blockCloseBy('placesAutoComplete');
    }
  }

  unblockCloseBy = (fieldName) => {
    this.blocks[fieldName] = false;
    setTimeout(() => {
      this.closeComment();
    }, 10);
  }

  unblockCloseByText = () => {
    this.unblockCloseBy('text');
  }

  unblockCloseByPlaces = () => {
    this.unblockCloseBy('places');
  }

  unblockCloseByTags = () => {
    this.unblockCloseBy('tags');
  }

  unblockCloseByCategories = () => {
    this.unblockCloseBy('categories');
  }

  unblockCloseByPhotos = () => {
    this.unblockCloseBy('photos');
  }

  unblockCloseByMouseLeave = () => {
    this.unblockCloseBy('mouseEnter');
  }


  unblockCloseByPlacesAutoComplete = () => {
    this.unblockCloseBy('placesAutoComplete');
  }

  togglePhotosSection = () => {
    // make sure this happens after the blur event of wherever else we came from triggers
    setTimeout(() => {
      this.setState((state) => ({ 
        isPhotosSectionOpen: !state.isPhotosSectionOpen, 
        isCommentOpen: true // Keep the form open
      }));

      setTimeout(() => {
        scrollToBottomOfPage();
      }, 200);
    }, 10);
  }

  togglePlacesSection = () => {
    // make sure this happens after the blur event of wherever else we came from triggers
    setTimeout(() => {
      this.setState((state) => ({ 
        isPlacesSectionOpen: !state.isPlacesSectionOpen,
        isCommentOpen: true // Keep the form open
      }));

      setTimeout(() => {
        scrollToBottomOfPage();
      }, 200);
    }, 10);
  }

  saveComment = (comment) => 
    (isCommentNew(comment)) ? 
      this.props.dispatchCreateComment(comment) : this.props.dispatchUpdateComment(comment);

  render() {
    const { comment, currentUserId, disabled, isNewComment, isDirty } = this.props;
    const { isCommentOpen, isPhotosSectionOpen, isPlacesSectionOpen } = this.state;
    const hideTags = true;
    
    if(!comment || this.state.resetForm) return null;

    return (
      
      <div 
        ref={ref => { this.ref = ref; }}
        className={`o-comment-editor o-form-reverse ${disabled ? 'o-editing-disabled' : ''} ${(!isNewComment || isDirty) ? 'isActivelyEditing' : ''}`}
      > 

        <PageFullWidthSection 
          className={`o-comment-section ${isCommentOpen ? 'open' : 'closed'}`}
          onClick={this.openComment}
          onMouseEnter={this.openComment} 
          onMouseLeave={this.closeComment}
        >
          <AutoForm 
            data={comment}
            autoFormInstance={this.setAutoFormInstance}
            processingHandler={this.saveComment}
            dontRemoveEditingObjectAfterSave={isNewComment}
            onProcessingComplete={this.onProcessingComplete}
            onCancel={this.onCancelEditComment}
            validator={validator}
            processingButtonText={this.getProcessingButtonText}
            prepareChildrenPlugins={this.prepareChildrenPlugins}
            hideToolbar
          >
            
              {isNewComment ? 
                (<UserAvatar id={currentUserId} />) : 
                (<UserByLine for={comment} showUserAvatar />)
              }
              
              {configuration.enableRichTextEditing ? (
                <RichTextField
                  valuePath="text"
                  placeholder="Type your comment"
                  disabled={disabled}
                  onFocus={this.blockCloseByText}
                  onBlur={this.unblockCloseByText}
                  providesSuggestedMetadata
                  className="o-form-control-rich-text-field-reverse"
                />
              ) : (
                <TextArea
                  valuePath="text"
                  placeholder="Type your comment"
                  disabled={disabled}
                  onFocus={this.blockCloseByText}
                  onBlur={this.unblockCloseByText}
                  providesSuggestedMetadata 
                  className="o-form-control-rich-text-field-reverse"
                />
              )}

              <Collapse isOpen={isCommentOpen}>
                <TagField 
                  valuePath="tags"
                  className="o-comment-tags"
                  placeholder="Tags"
                  disabled={disabled}
                  onFocus={this.blockCloseByTags}
                  onBlur={this.unblockCloseByTags} 
                  hidden={hideTags} />

                <CategoryField
                  valuePath="categoryIds"
                  className="o-comment-categories"
                  placeholder="Categories"
                  disabled={disabled}
                  onFocus={this.blockCloseByCategories}
                  onBlur={this.unblockCloseByCategories} />

                <PageFullWidthSection className="o-photo-component" isOpen={isPhotosSectionOpen}>
                  <PhotoGalleryBuilder 
                    valuePath="photoCollections[0]"
                    disabled={disabled}
                    onFilesSelected={this.unblockCloseByPhotos}
                    dropZoneConfig={{
                      onClick: this.blockCloseByPhotos,
                      onFileDialogCancel: this.unblockCloseByPhotos
                    }}
                    canDelete />
                </PageFullWidthSection>

                <PageFullWidthSection className="o-places-component" isOpen={isPlacesSectionOpen}>
                  <PlaceField
                    valuePath="places"
                    className="o-comment-places"
                    placeholder="Add relevant places here"
                    disabled={disabled}
                    onFocus={this.blockCloseByPlaces}
                    onBlur={this.unblockCloseBGy}
                    onDidAddValidatedPlace={this.unblockCloseByPlacesAutoComplete} />
                </PageFullWidthSection>

                <Toolbar textAlign="right">
                  <IconButton
                    onClick={this.togglePhotosSection}
                    className="o-component-button o-photo-component-button float-left"
                    >
                    <PhotoCamera />
                  </IconButton>

                  <IconButton
                    onClick={this.togglePlacesSection}
                    className="o-component-button o-places-component-button float-left"
                    >
                    <Place/>
                  </IconButton>  
                  
                  <CancelButton isAutoFormCancelButton />
                  <ProcessButton isAutoFormProcessButton />
                </Toolbar>

              </Collapse> 

          </AutoForm>
        </PageFullWidthSection>
      </div>
      
    );
  }
}

CommentEditor.propTypes = {
  // eslint-disable-next-line
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  disabled: PropTypes.bool,
  autoFormInstance: PropTypes.func,
  cancelEditComment: PropTypes.func
}

const mapStateToProps = (state, props) => {
  const commentId = props.id;
  const isNewComment = isNewCommentId(commentId);
  
  let comment;
  if(isNewCommentId(props.id)) {
    comment = { 
      ...getBlankModelFor(configuration.MODEL_TYPES.comment, { postId: props.postId })
    };
  } else {
    comment = state.comments[props.id];
  }
  

  const isDirty = isCommentDirty(state, commentId);  
  const post = state.posts[props.postId];
  const group = state.groups[post.groupId];

  const { currentUserId } = state;

  return { comment, currentUserId, group, isNewComment, isDirty};
}

const mapDispatchToProps = dispatch => ({
  dispatchAddEditingObject: (comment) => dispatch(editingActions.addEditingObject(comment)),
  dispatchRemoveEditingObject: (commentId) => dispatch(editingActions.removeEditingObject(commentId)),
  dispatchStartEditingComment: (comment) => dispatch(editingActions.startEditing(comment.id)),
  dispatchEnableAllNewComments: () => dispatch(editingActions.enableAllNewComments()),
  dispatchCreateComment: (createdComment) => dispatch(actions.createComment(createdComment)),
  dispatchUpdateComment: (updatedComment) => dispatch(actions.updateComment(updatedComment))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditor);