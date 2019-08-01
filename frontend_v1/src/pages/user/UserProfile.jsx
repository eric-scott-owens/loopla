import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { /* Link, */ withRouter } from 'react-router-dom';
import Settings from '@material-ui/icons/Settings';
import forEach from 'lodash/forEach';
import { formatPhoneNumber } from 'react-phone-number-input';
import get from 'lodash/get';
import Waypoint from 'react-waypoint';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import { navigateTo } from '../../containers/history/AppNavigationHistoryService';
import { getUserProfileUrl } from '../../utilities/UrlUtilities';
import * as actions from '../../containers/users/actions';
import * as groupActions from '../../containers/loops/actions';
import  * as postActions from '../../containers/posts/actions';
import * as commentActions from '../../containers/comments/actions';
import LoadMoreButton from '../../components/LoadMoreButton';

import Page from '../Page';
import * as editingObjectActions from '../../actions/editingObjects';
import DateFormatter from '../../components/DateFormatter';
import UserAvatar from '../../components/UserAvatar';
import UserAddress from '../../components/UserAddress';
import BasicButton from '../../components/BasicButton';
import IconButton from '../../components/IconButton';
import LoopSelector from '../../components/form-controls/LoopSelector';
import UserDisplayName from '../../components/UserDisplayName';
import PageFullWidthSection from '../../components/PageFullWidthSection';
import ProfileDividers from './ProfileDividers';
import PageBackButton from '../../components/PageBackButton';
import UserPostPreviewList from '../../components/UserPostPreviewList/UserPostPreviewList';
import TextFinder from '../../components/TextFinder';

import './UserProfile.scss';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false, 
      selectedGroupId: 0,
      dropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);

  }

  

  componentDidMount () {
    const userId = this.props.user ? this.props.user.id : this.props.id;
    
    if(
      !this.props.user &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.user)
    ) {
      this.props.dispatchFetchUser(userId);
      this.props.dispatchFetchPostCountForUser(userId, this.state.selectedGroupId);
    }
    this.props.dispatchGetPostsReferencesOlderThanForUser(undefined, userId, this.state.selectedGroupId, configuration.PAGE_SIZES.postPreviews);
   
    const displayedPostReferences = get(this.props, 'userState.displayedPostReferences', []);
    if(displayedPostReferences.length > 0) {
      this.props.dispatchBatchFetchPosts(displayedPostReferences.map(p => p.id));
    }

    if(this.props.isCurrentUsersPage) {
    
    this.props.dispatchFetchKudosForUser(userId);
    this.props.dispatchFetchCommentCountForUser(userId);

      forEach(this.props.loopIds, loop => {
        this.props.dispatchFetchGroup(loop);
      }) 
    }

  }
  

  shouldComponentUpdate(nextProps) {
    if(this.props.userState !== nextProps.userState) {
     
      const currentDisplayedPostReferences = get(this.props, 'userState.displayedPostReferences');
      const nextDisplayedPostReferences = get(nextProps, 'userState.displayedPostReferences');
      if(currentDisplayedPostReferences !== nextDisplayedPostReferences && nextDisplayedPostReferences && nextDisplayedPostReferences.length > 0) {
        // Batch fetch all our new stuff
        this.props.dispatchFetchPostCountForUser(this.props.user.id, this.state.selectedGroupId);
        nextProps.dispatchBatchFetchPosts(nextDisplayedPostReferences.map(p => p.id));
      }
      return false;
    }
    return true;
  }

  onSettings = () => {
    const { user } = this.props;
    navigateTo(`${getUserProfileUrl(user.id)}/settings`);
  }

  onLoopSelected = (groupId) => {
    this.setState({
      selectedGroupId: groupId
    })
    this.props.dispatchRemovePostsFromUserReferences(this.props.user.id);
    this.props.dispatchFetchPostCountForUser(this.props.user.id, groupId);
    this.props.dispatchGetPostsReferencesOlderThanForUser(undefined, this.props.user.id, groupId, configuration.PAGE_SIZES.postPreviews);
  }

  loadNextBatch = () => {
    const { userState } = this.props;
    const { selectedGroupId } = this.state;

    if(userState && userState.postsOlderThanDisplayedPostsEndDataExist) {
      const oldestDate = userState.displayedPostsEndDate ? userState.displayedPostsEndDate : undefined;
      this.props.dispatchGetPostsReferencesOlderThanForUser(oldestDate, this.props.user.id, selectedGroupId, configuration.PAGE_SIZES.postPreviews);
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen
    }));
  }
  
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const { 
      user, 
      userPostCounts, 
      /* userKudosStatistics, */ 
      isCurrentUsersPage, 
      loopIds, 
      userState } = this.props;

    const { selectedGroupId } = this.state;

    let userPostCount = 0;

    if (userPostCounts && userPostCounts[selectedGroupId]) {
      userPostCount = userPostCounts[selectedGroupId];
    }
      

      const visiblePostIds = userState && userState.displayedPostReferences ? userState.displayedPostReferences.map(r => r.id) : [];


    if (!user) {
      return "Loading...";
    }
    
    return (
      <div className="o-user-profile">
        <Page className="o-user-profile-header">
          <PageBackButton />
          
          <div>
            {isCurrentUsersPage && 
            <div>
              {isCurrentUsersPage && 
              <div>
                <IconButton type="button" className="o-settings-button" onClick={this.onSettings}><Settings /></IconButton>
              </div>
              }
            </div>
            }
          </div>
      

          <PageFullWidthSection>
            <div className="o-user-avatar-container">
              <UserAvatar id={user.id} dontLinkToProfile />
            </div>
          </PageFullWidthSection>

          {/* <div className="o-user-banner-container"> */}
            {/* <div className="o-user-banner-img" /> */}
          {/* </div> */}

          <div className="o-user-profile-info">

            <Row>
              <Col xs="6">
                <UserDisplayName id={user.id} dontLinkToProfile/>
              </Col>
              <Col xs="6">
                <BasicButton onClick={this.toggleModal} className="o-contact-button" color="mini">
                  Contact {user.firstName}
                </BasicButton>
              </Col>
            </Row>
              
            <div className="o-user-bio">
              <TextFinder>
                {user.biography}
              </TextFinder>
            </div>
          
            <div className="o-user-info">
              { 
              user.isShareAddress && 
                <span className=""> 
                  <UserAddress id={user.id} />
                  <ProfileDividers/> 
              </span> 
              }
              <span className="">Joined <DateFormatter date={user.dateJoined} /></span>
            </div>
          </div>

        </Page>

        <div className="o-user-profile-post-filter">
          {userPostCount} posts in
          <LoopSelector groupIds={loopIds} allowAllLoops onChange={this.onLoopSelected} value={this.state.selectedGroupId}/>
        </div>

        <div><UserPostPreviewList postIDs={visiblePostIds} /></div>

        {userState && userState.postsOlderThanDisplayedPostsEndDataExist && (
          <React.Fragment>
            <Waypoint onEnter={this.loadNextBatch} bottomOffset="-500px" fireOnRapidScroll />
            {userPostCount > 0 && (
              <LoadMoreButton onClick={this.loadNextBatch} />
            )}
          </React.Fragment>
          )}
        
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} className={`o-member-modal ${this.props.className}`}>
          <ModalHeader toggle={this.toggleModal}>Contact {user.firstName}</ModalHeader>
          <ModalBody>
            <div className="o-user-info o-user-contact">
              {user.isShareEmail !== true && user.isSharePhone !== true &&
                <p>{user.firstName} does not have contact information to share.</p>
              }
              <a href={`mailto:${user.email}`} target="_top">{user.isShareEmail && user.email}</a>
              {user.isShareEmail && user.isSharePhone &&
                <ProfileDividers/>
              }
              <a href={`tel:${user.telephoneNumber}`}>{user.isSharePhone && formatPhoneNumber(user.telephoneNumber, 'National')}</a>
            </div>
          </ModalBody>
          <ModalFooter>
            <BasicButton onClick={this.toggleModal}>Close</BasicButton>
          </ModalFooter>
        </Modal>
      
      </div>
      
    );
  }
}

UserProfile.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state, props) => {
  let { user } = props;
  if(!user) {
    if(props.id) user = state.users[props.id];
    else throw new Error("CRITICAL: Cannot load user. An id must be provided");
  }

  let userPostCounts;
  let userKudosStatistics;
  let userCommentCount;
  const loopIds = [];
  let userState;

  if(user) {
    userPostCounts = state.postCountByUser[user.id];
    userKudosStatistics = state.kudosStatisticsByUser[user.id];
    userCommentCount = state.commentCountByUser[user.id];  
    userState = get(state, `userStates[${user.id}]`);

    forEach(user.groups, loop => {
      loopIds.push(loop);
    })
  }

  const { currentUserId } = state;
  const isCurrentUsersPage = ( user && user.id === currentUserId );

  const { lastVisitedGroupId } = state;
  
  return { user, currentUserId, userPostCounts, userKudosStatistics, userCommentCount, isCurrentUsersPage, loopIds, lastVisitedGroupId, userState };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchUser: (userId) => dispatch(actions.fetchUser(userId)),
  dispatchFetchPostCountForUser: (userId, groupId) => dispatch(postActions.fetchPostCountForUser(userId, groupId)),
  dispatchFetchKudosForUser: (userId) => dispatch(actions.fetchKudosForUser(userId)),
  dispatchFetchGroup: (groupId) => dispatch(groupActions.fetchGroup(groupId)),
  dispatchAddEditingObject: (user) => dispatch(editingObjectActions.addEditingObject(user)),
  dispatchUpdateEditingObjectField: (userId, fieldName, fieldValue) => dispatch(editingObjectActions.updateEditingObjectField(userId, fieldName, fieldValue)),
  dispatchFetchCommentCountForUser: (userId) => dispatch(commentActions.fetchCommentCountForUser(userId)),
  dispatchGetPostsReferencesOlderThanForUser: (olderThan, userId, groupId, targetBatchSize) => dispatch(actions.getPostsReferencesOlderThanForUser(olderThan, userId, groupId, targetBatchSize)),
  dispatchBatchFetchPosts: (postIds) => dispatch(postActions.batchFetchPosts(postIds)),
  dispatchRemovePostsFromUserReferences: (userId) => dispatch(actions.removePostsFromUserReferences(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserProfile));