import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
import Refresh from '@material-ui/icons/Refresh';
import queryString from 'query-string';

import configuration from '../../../configuration';
import { fetchCategoryStatistics } from '../../../containers/categories/categoryStatistics/actions';
import { isActiveMember } from '../../../containers/loops/memberships/utilities';
import { receiveNewDashboardPostData } from '../../../containers/dashboard/actions';
import { setLastVisitedGroupId } from '../../../containers/loops/actions';
import { setLastVisitedCategoryId } from '../../../containers/categories/actions';
import { batchFetchPosts } from '../../../containers/posts/actions';
import { reportTakenTour } from '../../../containers/users/toursTaken/actions';
import { APP_EVENT_NAMES } from '../../../containers/appEvents/globalAppEventPublisher';
import joyrideConfig from './joyrideConfig';
import { scrollToElement, addBodyClass, getElementCoordinates } from '../../../utilities/StyleUtilities';
import { getPostPreviewDomId } from '../../../components/PostPreviews/PostPreview';
import { replaceCurrentNavigation } from '../../../containers/history/AppNavigationHistoryService';
import SOCKET_IO_EVENTS from '../../../../../socket-app/SOCKET_IO_EVENTS';
import { handleNewDashboardPostDataReceivedEvent } from '../../../containers/dashboard/appEventHandlers';

import FreezingStateTableWithPartialLoading from '../../../utilities/redux/FreezingStateTableWithPartialLoading';

import PageInitializer from '../../PageInitializer';
import PostPreviewList from '../../../components/PostPreviewList';
import LoopHeader from './LoopHeader';
import CreatePostButton from '../../../components/CreatePostButton';
import LoadMoreButton from '../../../components/LoadMoreButton';
import Toolbar from '../../../components/Toolbar';
import Joyride, { STATUS as JOYRIDE_STATUS, ACTIONS as JOYRIDE_ACTIONS, LIFECYCLE as JOYRIDE_LIFECYCLE, EVENTS as JOYRIDE_EVENTS } from '../../../components/Joyride';
import appEventSubscriber from '../../../containers/appEvents/appEventSubscriber';

import './DashboardPage.scss';
import UserEngagementSectionDesktop from '../../../components/UserEngagementSection/UserEngagementSectionDesktop';
import UserEngagementSectionMobile from '../../../components/UserEngagementSection/UserEngagementSectionMobile';

/**
 * Stores how many posts to display per loop & category combination
 * numberOfPostsToDisplay[loopId][categoryId] = integer
 */
const numberOfPostsToDisplayPerLoopAndCategory = {};

function getNumberOfPostsToDisplay(loopId, categoryId) {
  if(!numberOfPostsToDisplayPerLoopAndCategory[loopId]) {
    numberOfPostsToDisplayPerLoopAndCategory[loopId] = {};
  }

  if(!numberOfPostsToDisplayPerLoopAndCategory[loopId][categoryId || 'all']) {
    numberOfPostsToDisplayPerLoopAndCategory[loopId][categoryId || 'all'] = configuration.PAGE_SIZES.postPreviews
  }

  const count = numberOfPostsToDisplayPerLoopAndCategory[loopId][categoryId || 'all'];
  return count;
}

function extendTheNumberOfPostsToDisplay(loopId, categoryId) {
  // ensure we have a value;
  const newCount = getNumberOfPostsToDisplay(loopId, categoryId) + configuration.PAGE_SIZES.postPreviews;
  numberOfPostsToDisplayPerLoopAndCategory[loopId][categoryId || 'all'] = newCount;
}

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runJoyride: false,
      joyrideStep: 0, 
      postsWaitingToBeDisplayed: [],
    };

    this.restoreScrollContext = {
      jobIntervalId: undefined,
      postIdToScrollTo: undefined,
      postPreviewDomIdToScrollTo: undefined,
      postPreviewElementToScrollTo: undefined,
      lastCoordinates: undefined,
      attemptCount: 0
    };

    this.freezingStateTable = new FreezingStateTableWithPartialLoading();
    this.debouncedLoadNextBatch = debounce(this.loadNextBatch, 1500, { leading: true });
    this.morePostsAvailableToBeShown = false;
  }

  componentDidMount() {
    const { selectedLoopId } = this.props;
    this.props.dispatchSetLastVisitedGroupId(selectedLoopId);
    this.props.dispatchFetchCategoryStatistics(selectedLoopId);

    const categoryId = this.getCategoryIdFilterFromUrl(this.props);
    this.props.dispatchSetLastVisitedCategoryId(categoryId);
    this.loadPostDisplayData(this.props.categoryStatistics, this.props.posts, this.props.selectedLoopId, categoryId);

    const hasTakenDashboardTour = this.props.currentUser.toursTaken.dashboard;
    if(!hasTakenDashboardTour) {
      this.setState({ runJoyride: true });
      this.props.dispatchReportTakenTour('dashboard');
    }

    // Update app event handler registrations
    // This will allow us to override dashboard updates until the user
    // presses the button to load the new content.
    this.props.unsubscribeFromAppEvent(handleNewDashboardPostDataReceivedEvent, SOCKET_IO_EVENTS.posts.dataReceived)
    this.props.subscribeToAppEvent(this.overrideHandleNewDashboardPostDataReceivedEvent, SOCKET_IO_EVENTS.posts.dataReceived);
    this.props.subscribeToAppEvent(this.startDashboardTour, APP_EVENT_NAMES.startPageTour);

    // Restore scroll
    const postIdToScrollTo = get(this.props, 'location.state.postIdToScrollTo');
    if(postIdToScrollTo) {
      this.tryRestoreScrollPosition(postIdToScrollTo);
    }
  }

  shouldComponentUpdate(nextProps) {

    const nextCategory = this.getCategoryIdFilterFromUrl(nextProps);
    const currentCategory = this.getCategoryIdFilterFromUrl(this.props);

    const nextSelectedLoopId = this.props.selectedLoopId;
    const currentSelectedLoopId = nextProps.selectedLoopId;

    // If the loop selector has changed
    if (
      currentSelectedLoopId !== nextSelectedLoopId
      || currentCategory !== nextCategory
    ) {
      if(currentSelectedLoopId !== nextSelectedLoopId) {
        this.props.dispatchSetLastVisitedGroupId(nextProps.selectedLoopId);
        this.props.dispatchFetchCategoryStatistics(nextProps.selectedLoopId);
      }
      
      if(currentCategory !== nextCategory) {
        this.props.dispatchSetLastVisitedCategoryId(nextCategory);
      }
      
      // Reset all the data we are trying to show
      // and load new data into the freezingStateTable
      this.freezingStateTable.reset();
      this.loadPostDisplayData(nextProps.categoryStatistics, nextProps.posts, nextProps.selectedLoopId, nextCategory);
    }
    else if(this.props.categoryStatistics !== nextProps.categoryStatistics) {
      this.loadPostDisplayData(nextProps.categoryStatistics, nextProps.posts, nextProps.selectedLoopId, nextCategory);
    } 
    else if(this.props.posts !== nextProps.posts) {
      // If our loaded post data has updated
      // See if any of if matches up with the data we want to load
      this.freezingStateTable.loadMissingDataFrom(nextProps.posts);
    }

    const currentPostIdToScrollTo = get(this.props, 'location.state.postIdToScrollTo');
    const nextPostIdToScrollTo = get(nextProps, 'location.state.postIdToScrollTo');
    if(nextPostIdToScrollTo && nextPostIdToScrollTo !== currentPostIdToScrollTo) {
      this.tryRestoreScrollPosition(nextPostIdToScrollTo);
    } else if (!nextPostIdToScrollTo){
      this.cancelScrollToPost();
    }

    return true;
  }

  componentWillUnmount() {

    this.cancelScrollToPost();

    // Update app event handler registrations
    // This will allow return updating dashboards to normal
    this.props.unsubscribeFromAppEvent(this.startDashboardTour, APP_EVENT_NAMES.startPageTour);
    this.props.unsubscribeFromAppEvent(this.overrideHandleNewDashboardPostDataReceivedEvent, SOCKET_IO_EVENTS.posts.dataReceived);
    this.props.subscribeToAppEvent(handleNewDashboardPostDataReceivedEvent, SOCKET_IO_EVENTS.posts.dataReceived)
  }

  getPostReferencesToDisplay = (categoryStatistics, loopId, categoryId) => {

    // Collect the posts that should be displayed for the current category
    const postsReferencesToDisplayDictionary = {};
    forEach(categoryStatistics, statistic => {
      if (
        statistic.groupId === loopId
        && (statistic.categoryId == categoryId) /* We want null and undefined to be equal */
      ) {
        forEach(statistic.postReferences, pr => {
          postsReferencesToDisplayDictionary[pr.id] = pr;
        });
      }
    });

    const postsReferencesToDisplay = values(postsReferencesToDisplayDictionary);
    postsReferencesToDisplay.sort((a, b) => b.newestUpdate.getTime() - a.newestUpdate.getTime());
    return postsReferencesToDisplay;
  }

  getCategoryIdFilterFromUrl = (props) => {
    const urlQueryParameters = get(props, 'location.search');
    const categoryIdQuery = queryString.parse(urlQueryParameters);
    const categoryId = get(categoryIdQuery, 'c');
    return categoryId ? parseInt(categoryId, 10) : undefined;
  }

  loadPostDisplayData = (categoryStatistics, posts, loopId, categoryId) => {
      const postReferencesToDisplay = this.getPostReferencesToDisplay(categoryStatistics, loopId, categoryId);
      const postIds =  postReferencesToDisplay.map(pr => pr.id);
      const numberOfPostsToDisplay = getNumberOfPostsToDisplay(loopId, categoryId);
      let postIdsWindowed = postIds;
      
      if(postIds.length > numberOfPostsToDisplay) {
        this.morePostsAvailableToBeShown = true;
        postIdsWindowed = postIdsWindowed.slice(0, numberOfPostsToDisplay);
      } else {
        this.morePostsAvailableToBeShown = false;
      }

      this.props.dispatchBatchFetchPosts(postIdsWindowed);
      this.freezingStateTable.setIdsToDisplay(postIdsWindowed);
      this.freezingStateTable.loadMissingDataFrom(posts);
  }

  tryRestoreScrollPosition = (postIdToScrollTo) => {
    // Make sure we stop trying to scroll to anything else
    this.cancelScrollToPost();

    // See if we have a scenario that makes trying to scroll worth while
    const displayedPostReferences = this.freezingStateTable.getPublishedDisplay();

    if(
      postIdToScrollTo // We've been passed a postId to scroll to via the location's state properties
      && findIndex(displayedPostReferences, p => p.id === postIdToScrollTo) > -1 // The ID is being displayed (or will be soon)
    ) {
      this.restoreScrollContext.postIdToScrollTo = postIdToScrollTo;
      this.restoreScrollContext.postPreviewDomIdToScrollTo = getPostPreviewDomId(postIdToScrollTo);
      this.restoreScrollContext.jobIntervalId = setInterval(() => { this.scrollToPost(); }, 50);
    }
  }

  cancelScrollToPost = () => {
    if(this.restoreScrollContext.jobIntervalId) {
      clearInterval(this.restoreScrollContext.jobIntervalId);
    }
    
    this.restoreScrollContext.jobIntervalId = undefined;
    this.restoreScrollContext.postIdToScrollTo = undefined;
    this.restoreScrollContext.postPreviewDomIdToScrollTo = undefined;
    this.restoreScrollContext.postPreviewElementToScrollTo = undefined;
    this.restoreScrollContext.lastCoordinates = undefined;
    this.restoreScrollContext.attemptCount = 0;
  }

  scrollToPost = () => {
    const context = this.restoreScrollContext;

    context.attemptCount += 1;
    if(context.attemptCount > 100) {
      this.cancelScrollToPost();
      return;
    }

    if(!context.postPreviewElementToScrollTo) {
      context.postPreviewElementToScrollTo = document.getElementById(context.postPreviewDomIdToScrollTo);
    }
    
    // If the element isn't on the page, give up.
    // We'll try again later when the element has actually 
    // been rendered. 
    if (!context.postPreviewElementToScrollTo) {
      return;
    }

    // Wait for the post preview to stop moving around as the screen draws
    // Otherwise we will scroll to the wrong place
    const newCoordinates = getElementCoordinates(context.postPreviewElementToScrollTo);
    if (
      !context.lastCoordinates
      || context.lastCoordinates.left !== newCoordinates.left
      || context.lastCoordinates.top !== newCoordinates.top
      ) 
    {
      context.lastCoordinates = newCoordinates;
      return;
    }

    scrollToElement(context.postPreviewElementToScrollTo);
    this.cancelScrollToPost();

  }

  overrideHandleNewDashboardPostDataReceivedEvent = (newDashboardPostDataReceivedEvent) => {
    const postsToWaitToLoad = [];
    const postsToLoadNow = [];
    const postsToForceUpdateNow = [];

    const frozenState = this.freezingStateTable.getPublishedFrozenState();

    // Figure out what can be updated now, and what needs updated later
    forEach(newDashboardPostDataReceivedEvent.data, post => {
      if(post.groupId === this.props.selectedLoopId) {
        // It's in this group, we might need to load it later

        const frozenPost = frozenState[post.id];
        if(frozenPost) {
          if(frozenPost.newestUpdate < post.newestUpdate) {
            // This is an update for an existing post on the display.
            if(post.ownerId === this.props.currentUser.id) {
              // If it's from the current user, just update now
              postsToForceUpdateNow.push(post);
            }
            else {
              // Otherwise, show the update button so the user knows something changed
              postsToWaitToLoad.push(post);
            }
          }
        }
        else {
          // We've not seen this post before, load it later
          postsToWaitToLoad.push(post);
        }
      } else {
        postsToLoadNow.push(post);
      }
    });

    if(postsToWaitToLoad.length > 0) {
      this.setState((state) => ({
        postsWaitingToBeDisplayed: state.postsWaitingToBeDisplayed.concat(postsToWaitToLoad)
      }));
    }

    if(postsToForceUpdateNow.length > 0 || postsToLoadNow.length > 0) {
      
      if(postsToForceUpdateNow.length > 0) {
        forEach(postsToForceUpdateNow)
        this.freezingStateTable.updateFrozenResourceData(postsToForceUpdateNow);
      }
      
      this.props.dispatchFetchCategoryStatistics(this.props.selectedLoopId);
    }

  }

  displayNewPostDataReceived = () => {
    this.setState({ postsWaitingToBeDisplayed: [] });
    this.freezingStateTable.reset();
    this.props.dispatchFetchCategoryStatistics(this.props.selectedLoopId);
  }

  startDashboardTour = () => {
    this.setState({ runJoyride: true });
    this.props.dispatchReportTakenTour('dashboard');
  }

  loadNextBatch = () => {
    const { selectedLoopId, categoryStatistics, posts } = this.props;
    const categoryId = this.getCategoryIdFilterFromUrl(this.props);

    if(this.morePostsAvailableToBeShown) {
      extendTheNumberOfPostsToDisplay(selectedLoopId, categoryId);
      this.loadPostDisplayData(categoryStatistics, posts, selectedLoopId, categoryId);
    }
  }

  filterOnSelectedCategory = (selectedCategoryId) => {
    if(selectedCategoryId) {
      const url = `${configuration.APP_ROOT_URL}/loop/${this.props.selectedLoopId}/dashboard/?c=${selectedCategoryId}`;
      replaceCurrentNavigation(url);
    } else {
      const url = `${configuration.APP_ROOT_URL}/loop/${this.props.selectedLoopId}/dashboard/`;
      replaceCurrentNavigation(url);
    }
  }

  handleJoyrideCallback = (data) => {
    const { status, action, index, lifecycle, size, type } = data;

    if (status === JOYRIDE_STATUS.FINISHED) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ runJoyride: false, joyrideStep: 0 });
    }

    if(action === JOYRIDE_ACTIONS.NEXT && lifecycle === JOYRIDE_LIFECYCLE.COMPLETE ) {
      this.setState({ joyrideStep: index + 1 });
    }

    if(action === JOYRIDE_ACTIONS.SKIP) {
      if(index === size-1) {
        this.setState({ runJoyride: false, joyrideStep: 0 });
      }
      else {
        this.setState({ joyrideStep: size-1, runJoyride: false });
        setTimeout(() => {
          this.setState({ runJoyride: true });
          addBodyClass('overflow-hidden');
        }, 10);
      }
    }

    if (
      action === JOYRIDE_ACTIONS.PREV
      && lifecycle === JOYRIDE_LIFECYCLE.COMPLETE
      && status === JOYRIDE_STATUS.RUNNING
      && type === JOYRIDE_EVENTS.STEP_AFTER
    ){
      setTimeout(() => { this.setState({ joyrideStep: index - 1}); }, 100);
     }
  }

  render() {
    const { selectedLoopId, selectedLoop, isUserActiveLoopMember } = this.props;
    const { postsWaitingToBeDisplayed } = this.state;
    const posts = this.freezingStateTable.getPublishedDisplay();
    const isLoading = this.freezingStateTable.isLoading();

    const activeCategory = this.getCategoryIdFilterFromUrl(this.props);

    if(!selectedLoop) {
      return "Loading...";
    }

    return (
      <PageInitializer>
        <div key={selectedLoopId} className="o-loop-dashboard" >
          <Joyride
            steps={joyrideConfig.steps}
            run={this.state.runJoyride}
            stepIndex={this.state.joyrideStep}
            callback={this.handleJoyrideCallback}
            showProgress
            continuous
          />

          <LoopHeader currentLoopId={selectedLoopId} onSelectCategory={this.filterOnSelectedCategory} selectedCategoryId={activeCategory}/>

          {postsWaitingToBeDisplayed && postsWaitingToBeDisplayed.length > 0 && (
            <div className="o-notification-button-container">
              <button type="button" className="btn o-notification-button" onClick={this.displayNewPostDataReceived}>
                <span className="o-button-icon"><Refresh /></span>Load new content</button>
            </div>
          )}

          { isUserActiveLoopMember && (
            <Toolbar className="d-none d-md-block" enableResponsivePageContainer side="right" position="fixed">
              {/* <CreatePostButton orientation="vertical" /> */}
            </Toolbar>
          )}
          <UserEngagementSectionMobile currentLoopId={selectedLoopId}/>
          <UserEngagementSectionDesktop currentLoopId={selectedLoopId}/>
          <div><PostPreviewList posts={posts} /></div>

          {this.morePostsAvailableToBeShown && !isLoading && (
            <React.Fragment>
              <Waypoint onEnter={this.debouncedLoadNextBatch} bottomOffset="-500px" fireOnRapidScroll />
              <LoadMoreButton onClick={this.debouncedLoadNextBatch} />
              <br /><br /><br />
            </React.Fragment>
          )}

        </div>
      </PageInitializer>
    )
  }
}
DashboardPage.propTypes = {
  // This really is used :P
  // eslint-disable-next-line
  match: PropTypes.shape({
    params: PropTypes.shape({
      loopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired
  }).isRequired
}

const mapStateToProps = (state, props) => {
  const { error, currentUserId, posts, categories, categoryStatistics } = state;
  const idParam = get(props, 'match.params.loopId');
  const selectedLoopId = parseInt(idParam, 10);
  const selectedLoop = state.groups[selectedLoopId];
  const isUserActiveLoopMember = isActiveMember(state, currentUserId, selectedLoopId);
  const currentUser = state.users[currentUserId];
  
  return { posts, error, selectedLoopId, selectedLoop, isUserActiveLoopMember, currentUser, categories, categoryStatistics };
}

const mapDispatchToProps = dispatch => ({
  dispatchSetLastVisitedGroupId: (groupId) => dispatch(setLastVisitedGroupId(groupId)),
  dispatchSetLastVisitedCategoryId: (categoryId) => dispatch(setLastVisitedCategoryId(categoryId)),
  dispatchBatchFetchPosts: (postIds) => dispatch(batchFetchPosts(postIds)),
  dispatchReportTakenTour: (tourName) => dispatch(reportTakenTour(tourName)),
  dispatchReceiveNewDashboardPostData: (updatedPosts) => dispatch(receiveNewDashboardPostData(updatedPosts)),
  dispatchFetchCategoryStatistics: (groupId) => dispatch(fetchCategoryStatistics({ groupId }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(appEventSubscriber(DashboardPage)));
