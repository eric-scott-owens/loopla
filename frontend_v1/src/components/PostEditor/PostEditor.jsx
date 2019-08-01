import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Place from '@material-ui/icons/Place';
import get from 'lodash/get';

// import { IconButton } from '@material-ui/core';
import configuration from '../../configuration';
import { getBlankModelFor, newKeyFor, isObjectNew as isPostNew } from '../../utilities/ObjectUtilities';
import * as actions from '../../containers/posts/actions';
import { reportTakenTour } from '../../containers/users/toursTaken/actions';
import { navigateBackTo } from '../../containers/history/AppNavigationHistoryService';
import { getLoopDashboardUrl } from '../../utilities/UrlUtilities';
import appEventSubscriber from '../../containers/appEvents/appEventSubscriber';
import { APP_EVENT_NAMES } from '../../containers/appEvents/globalAppEventPublisher';

import AutoForm from '../AutoForm';
import TextField from '../form-controls/TextField';
import TextArea from '../form-controls/TextArea';
import RichTextField from '../form-controls/RichTextField';
import PlaceField from '../form-controls/PlaceField';
import TagField from '../form-controls/TagField';
import CategoryField from '../form-controls/CategoryField';
import PhotoGalleryBuilder from '../form-controls/PhotoGalleryBuilder';
import PostValidator from '../../containers/posts/validator';
import Toolbar from '../Toolbar';
import IconButton from '../IconButton';
import PageFullWidthSection from '../PageFullWidthSection';
import PageBackButton from '../PageBackButton';
import * as editingObjectActions from '../../actions/editingObjects';
import Joyride, { STATUS as JOYRIDE_STATUS } from '../Joyride';
import { ProcessButton, CancelButton } from '../AutoForm/AutoFormToolbar';


// AutoForm PrepareChildrenPlugins
import AutoTrimTextPlugin from '../AutoForm/PrepareChildrenPlugins/AutoTrimTextPlugin';
import CategoryManagerPlugin from '../../containers/categories/autoFormPlugins/prepareChildrenPlugins/CategoryManagerPlugin';
import PlaceManagerPlugin from '../../containers/places/autoFormPlugins/prepeareChildrenPlugins/PlaceManagerPlugin';
import ProvidesSuggestedMetadataPlugin from '../../containers/tags/autoFormPlugins/prepareChildrenPlugins/ProvideSuggestedMetadataPlugin';
import TagManagerPlugin from '../../containers/tags/autoFormPlugins/prepareChildrenPlugins/TagManagerPlugin';

import "./PostEditor.scss";

const validator = new PostValidator();

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPhotosSectionOpen: (get(props, 'post.photoCollections[0].photoCollectionPhotos.length', 0) > 0),
      isPlacesSectionOpen: (get(props, 'post.places.length', 0) > 0),
      joyrideConfig: {
        steps: [
          {
            target: '.o-joyride-01',
            title: 'Create a Post',
            content: "Choose one of your loops to post to. Add a title and content.",
            disableBeacon: true,
            disableOverlay: false,
          },
          {
            target: '.o-tag-field',
            title: 'Add Tags',
            content: 'Add keywords to your post so you and others can find them later.',
            disableBeacon: true
          },
          {
            target: '.o-photo-component-button',
            title: 'Add Photos',
            content: '', // content: 'Add photos to your post.',
            disableBeacon: true
          },
          {
            target: '.o-places-component-button',
            title: 'Add Places',
            content: 'Add geographic locations or businesses.',
            disableBeacon: true
          },
          {
            target: '.ribbon-nav',
            title: 'Go Back',
            content: 'Click here to go back to your loop.',
            disableBeacon: true
          }
        ]
      },
      runJoyride: false
    };
    this.prepareChildrenPlugins = [
      new AutoTrimTextPlugin(),
      new CategoryManagerPlugin(),
      new PlaceManagerPlugin(),
      new ProvidesSuggestedMetadataPlugin(),
      new TagManagerPlugin()
    ];

    this.dontReinitialize = false;
    this.modalOnNavigateBack = false;
  }

  componentDidMount() {
    const { post } = this.props;
    if(post)
    {
      let newState;
      if(post.photos && post.photos.length > 0){
        newState = { isPhotosSectionOpen: true };
      }
      if(post.places && post.places.length > 0) {
        if(!newState) { newState = {}; }
        newState.isPlacesSectionOpen = true;
      }

      if(newState) {
        this.setState(newState);
      }
    }

    const hasTakenPostEditorTour = this.props.currentUser.toursTaken.postEditor
    if(!hasTakenPostEditorTour) {
      this.setState({ runJoyride: true });
      this.props.dispatchReportTakenTour('postEditor');
    }

    this.props.subscribeToAppEvent(this.startDashboardTour, APP_EVENT_NAMES.startPageTour);
  }

  componentWillUnmount() {
    this.props.dispatchRemoveEditingObject(this.props.post.id); // this needs to be remove editing object
    this.dontReinitialize = true;
    this.props.unsubscribeFromAppEvent(this.startDashboardTour, APP_EVENT_NAMES.startPageTour);
  }

  onCancel = () => {
    this.dontReinitialize = true;
    if(this.props.onCancel) {
      this.props.onCancel();
    } 
  }

  onSavePost = (post) => {
    this.dontReinitialize = true;
    this.modalOnNavigateBack = false;

    if (isPostNew(post)) { 
      this.props.dispatchCreatePost(post); 
    } 
    else {
      this.props.dispatchUpdatePost(post);
    }
  }

  onSaveComplete = (editingObject) => {
    navigateBackTo(getLoopDashboardUrl(editingObject.groupId));
  }

  getProcessingButtonText = (post, props, isProcessing) => {
    if(isPostNew(post)) {
      return isProcessing ? 'Posting...' : 'Post';
    }

    return isProcessing ? 'Saving...' : 'Save';
  }
     
  startDashboardTour = () => {
    this.setState({ runJoyride: true });
    this.props.dispatchReportTakenTour('postEditor');
  }

  handleJoyrideCallback = (data) => {
    const { status } = data;

    if ([JOYRIDE_STATUS.FINISHED, JOYRIDE_STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ runJoyride: false });
    }
  }

  togglePhotosSection = () => {
    this.setState((state) => ({ isPhotosSectionOpen: !state.isPhotosSectionOpen }));
  }

  togglePlacesSection = () => {
    this.setState((state) => ({ isPlacesSectionOpen: !state.isPlacesSectionOpen }));
  }

  render() {
    const { post, isUpdate, isActivelyEditing } = this.props;
    const { isPhotosSectionOpen, isPlacesSectionOpen, joyrideConfig } = this.state;
    const hideTags = true;

    if(!post) return null;

    return (
      <div className={`o-post-editor ${isActivelyEditing ? 'isActivelyEditing' : ''}`}>

        <Joyride 
          steps={joyrideConfig.steps}
          run={this.state.runJoyride}
          callback={this.handleJoyrideCallback}
          showProgress
          continuous
        />

        <PageBackButton goBackToDashboard />

        <h1 className="text-center o-m-bottom-lg">{isUpdate ? 'Edit Post' : 'Ask Question'}</h1>
      
        <AutoForm
          data={post}
          validator={validator}
          onCancel={this.onCancel}
          processingHandler={this.onSavePost}
          onProcessingComplete={this.onSaveComplete}
          prepareChildrenPlugins={this.prepareChildrenPlugins}
          dontInitialize={this.dontReinitialize}
          confirmCancel
          hideToolbar
        >
          <div className="o-joyride-01">
            {/* {!isUpdate && (
              <LoopSelector
                valuePath="groupId"
                disabled={isUpdate}
                className="" />
            )} */}
            <TextField
              className="o-post-title"
              placeholder="Title*"
              valuePath="summary"
              autoTrimText
              providesSuggestedMetadata />

            {configuration.enableRichTextEditing ? (
              <RichTextField
                className="o-post-body-text"
                placeholder="Content*"
                valuePath="text"
                autoTrimText
                providesSuggestedMetadata />
            ) : (
              <TextArea
                className="o-post-body-text"
                placeholder="Content*"
                valuePath="text"
                autoTrimText
                providesSuggestedMetadata />
            )}
          </div>
          
          <TagField 
            valuePath="tags"
            className="o-post-tags"
            placeholder="Tags (Add keywords related to your post)" 
            hidden={hideTags} />

          <CategoryField
            valuePath="categoryIds"
            className="o-post-categories"
            placeholder="Categories" />

          <PageFullWidthSection className="o-photo-component" isOpen={isPhotosSectionOpen}>
            <PhotoGalleryBuilder 
              valuePath="photoCollections[0]"
              canDelete />
          </PageFullWidthSection>

          <PageFullWidthSection className="o-places-component" isOpen={isPlacesSectionOpen}>
              <PlaceField
                valuePath="places"
                className="o-post-places"
                placeholder="Add relevant places here" />
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

        </AutoForm>
      </div>
    )
  }
}

PostEditor.propTypes = {
  // eslint-disable-next-line
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isActivelyEditing: PropTypes.bool,
};

const mapStateToProps = (state, props) => {
  const { lastVisitedGroupId } = state;
  const { currentUserId } = state;
  const currentUser = state.users[currentUserId];
  const categoryIdFilter = state.lastVisitedCategoryId;

  let isUpdate = true;
  let post;
  if(props.id === newKeyFor(configuration.MODEL_TYPES.post)) {
    isUpdate = false;
    post = getBlankModelFor(configuration.MODEL_TYPES.post);

    if(state.lastVisitedGroupId) {
      post.groupId = state.lastVisitedGroupId;
    }
    if(categoryIdFilter) {
      post.categoryIds.push(categoryIdFilter);
    }
  } else {
    post = state.posts[props.id];
  }

  return { post, lastVisitedGroupId, isUpdate, currentUser, categoryIdFilter };
};

const mapDispatchToProps = dispatch => ({
  dispatchCreatePost: (createdPost) => dispatch(actions.createPost(createdPost)),
  dispatchUpdatePost: (updatedPost) => dispatch(actions.updatePost(updatedPost)),
  dispatchReportTakenTour: (tourName) => dispatch(reportTakenTour(tourName)),
  dispatchRemoveEditingObject: (postId) => dispatch(editingObjectActions.removeEditingObject(postId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(appEventSubscriber(PostEditor));