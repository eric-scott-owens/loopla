import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { IntlProvider } from 'react-intl';
import { Container } from 'reactstrap';
import socketIOClient from "socket.io-client";
import forEach from 'lodash/forEach';

import configuration from './configuration';
import * as reduxStoreProvider from './containers/reduxStoreProvider';

import fetchMiddleware, { FetchStateTracker } from './middleware/fetchMiddleware';
import fetchResourceMiddleware from './middleware/fetchResourceMiddleware';
import validationMiddleware from './middleware/validationMiddleware';
import userAuthMiddleware from './middleware/userAuthMiddleware';
import performanceProfilingMiddleware from './middleware/performanceProfilingMiddleware';

import reducers from './reducers';

import { AsyncStorage, StorageStrategyAdapter } from './services/AsyncStorage';

import globalPostLoginTaskRunner from './containers/auth/globalPostLoginTaskRunner';
import CommandRunner from './containers/commands/CommandRunner';

import ClientServerModelMapperService from './services/ClientServerModelMapperService';
import * as categoryMappers from './containers/categories/mappers';
import * as postMappers from './containers/posts/mappers';
import * as commentMappers from './containers/comments/mappers';
import * as loopMappers from './containers/loops/mappers';
import * as tagMappers from './containers/tags/mappers';
import * as placeMappers from './containers/places/mappers';
import * as googlePlaceMappers from './containers/places/googlePlaces/mappers';
import * as photoMappers from './containers/photos/mappers';
import * as userMappers from './containers/users/mappers';
import * as summaryPreferenceMappers from './containers/users/summaryPreferences/mappers';
import * as feedbackMappers from './containers/feedback/mappers';

import StoreStorageService from './services/StoreStorageService';
import GooglePlacesService from './services/GooglePlacesService';
import { globalGoogleTagService } from './containers/tags/GoogleTagService';

import googlePlacesMiddleware from './middleware/googlePlacesMiddleware';

import * as categoryActions from './containers/categories/actions';
import * as userActions from './containers/users/actions';
import * as userAuthActions from './containers/auth/actions';
import * as groupActions from './containers/loops/actions';
import * as membershipActions from './containers/loops/memberships/actions';
import * as telemetryActions from './containers/telemetry/actions';

import { isLoggedIn } from './containers/auth/reducers';

import LoginPage from './pages/login';
import TopNavBar from './pages/TopNavBar';
import SystemActivityIndicator from './components/SystemActivityIndicator';

import DashboardPage from './pages/loop/dashboard/DashboardPage';
import SearchPage from './pages/search';
import PostPage from './pages/posts';
import UserProfilePage from './pages/user';
import UserSettingsPage from './pages/user/settings/UserSettingsPage';
import LoopSettings from './pages/loop/settings';
import InvitationPage from './pages/invitation';
import MultiUseInvitationPage from './pages/multiUseInvitation';
import RegisterPage from './pages/register';
import NotificationsPage from './pages/notifications';

import ErrorPage404 from './pages/error/404';
import ForgotPasswordPage from './pages/forgot-password';
import ForgotPasswordConfirmPage from './pages/forgot-password/sent';
import ForgotPasswordResetPage from './pages/password-reset';
import ForgotPasswordResetCompletePage from './pages/password-reset/complete';
import PrivacyPolicyPage from './pages/public/privacy-policy';
import LandingPage from './pages/public/landing';
import AboutPage from './pages/public/about';
import CareersPage from './pages/public/careers';
import TermsOfServicePage from './pages/public/terms-of-service';
import DocumentationPage from './pages/documentation';
import CreateLoopPage from './pages/loop/new';
import HowItWorksPage from './pages/public/how-it-works';
import ShopPage from './pages/shop';

import withGoogleAnalytics from './containers/telemetry/withGoogleAnalytics';

import SOCKET_IO_EVENTS from '../../socket-app/SOCKET_IO_EVENTS';
import globalAppEventPublisher from './containers/appEvents/globalAppEventPublisher';
import { setupHandleNewDashboardPostDataReceivedEvent, handleNewDashboardPostDataReceivedEvent } from './containers/dashboard/appEventHandlers';
import registerNewPostMessageReceiver from './containers/messaging/newPostDataRecieved/registerMessageReceiver';

import { getLoopDashboardUrl } from './utilities/UrlUtilities';
import { replaceCurrentNavigation, init as initializeNavigationService } from './containers/history/AppNavigationHistoryService';

import './App.scss';
import BottomToolbar from './components/BottomToolbar';

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

let authRequiredRoutes = [];
let publicRoutes = [];

const BOVIK_GROUP_ID = 71;

class App extends React.Component{ 

  componentDidMount() {
    initializeNavigationService(this.props.history);
  }

  shouldComponentUpdate(nextProps) {

    // Handle URL overrides
    if(nextProps.hasLoadedAuthToken) {

      if(nextProps.location.pathname === `${configuration.APP_ROOT_URL}/`  && this.props.location.pathname === `${configuration.APP_ROOT_URL}/` && this.props.isUserLoggedIn)  {
        let {lastVisitedGroupId} = nextProps.state;
        const { groups } = nextProps.state;
        if (!lastVisitedGroupId) {
          if(Object.keys(groups).length > 0) {
            const keys = Object.keys(groups);
            let groupToChoose = groups[keys[0]];
      
            if(groupToChoose) {
              let groupToChooseId = groupToChoose.id ? groupToChoose.id : groupToChoose;
              if(groupToChooseId === BOVIK_GROUP_ID) {
                if(keys.length > 1 && groups[keys[1]]){
                  groupToChoose = groups[keys[1]];
                  groupToChooseId = groupToChoose.id ? groupToChoose.id : groupToChoose;
                }
              }
              
              lastVisitedGroupId = groupToChooseId;       
              this.props.dispatchSetLastVisitedGroupId(lastVisitedGroupId); 
            }
          }
        }
        
        if(lastVisitedGroupId) {
          replaceCurrentNavigation(getLoopDashboardUrl(lastVisitedGroupId));
        }
      }
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.hasLoadedAuthToken
      && (
        this.props.location.pathname !== prevProps.location.pathname
        || this.props.isUserLoggedIn !== prevProps.isUserLoggedIn
        || this.props.hasLoadedAuthToken !== prevProps.hasLoadedAuthToken
      )
    ) {

      let previousUrl = prevProps.location.pathname;
      if(this.props.location.pathname === prevProps.location.pathname && this.props.isUserLoggedIn === prevProps.isUserLoggedIn) {
        // In this case we haven't really come from anywhere else. Mark this as null
        previousUrl = null;
        
      }

      // Log navigation changes
      const navigationContext = {
        url: this.props.location.pathname,
        previousUrl
      };

      this.props.dispatchLogNavigationAction(navigationContext);

    }
  }

  render() {
    const { isUserLoggedIn, hasLoadedAuthToken, currentUserId, groupToSetHome } = this.props;
    const { APP_ROOT_URL, APP_SEARCH_URL } = configuration;

    if (!groupToSetHome && isUserLoggedIn) return null;

    let loginGroupId = null;
    if (groupToSetHome){
      loginGroupId = groupToSetHome;
    }

    if(loginGroupId == null && isUserLoggedIn) return null;

    if(!hasLoadedAuthToken) return null;
    if (isUserLoggedIn && !currentUserId) return null;
    
    authRequiredRoutes =  [
      (<Route path={`${APP_SEARCH_URL}`} component={SearchPage} key="SearchPage"/>),
      (<Route path={`${APP_ROOT_URL}/notifications`} component={NotificationsPage} key="NotificationsPage"/>),
      (<Route path={`${APP_ROOT_URL}/loop/:loopId/dashboard`} component={DashboardPage} key="DashboardPage"/>),
      (<Route path={`${APP_ROOT_URL}/loop/:loopId/settings/:activeTab`} component={LoopSettings} key="LoopSettings"/>),
      (<Route path={`${APP_ROOT_URL}/loop/new/`} component={CreateLoopPage} key="CreateLoopPage"/>),
      (<Route path={`${APP_ROOT_URL}/users/:id/settings`} component={UserSettingsPage} key="UserSettingsPage"/>),
      (<Route path={`${APP_ROOT_URL}/users/:id`} component={UserProfilePage} key="UserProfilePage"/>),
      (<Route path={`${APP_ROOT_URL}/posts/:id`} component={PostPage} key="PostPage" />),
    ];
    
    if(configuration.KUDOS_SHOP_ENABLED) {
      authRequiredRoutes.push(
        (<Route path={`${APP_ROOT_URL}/shop/`} component={ShopPage} key="ShopPage" />)
      );
    }

    publicRoutes = 
      [
        (<Route exact path={`${APP_ROOT_URL}/learn-more/`} render={(props) => <LandingPage {...props} isUserLoggedIn={isUserLoggedIn} />} key="LandingPage" />),
        (<Route path={`${APP_ROOT_URL}/about/`} component={AboutPage} key="AboutPage" />),
        (<Route path={`${APP_ROOT_URL}/careers/`} component={CareersPage} key="CareersPage" />),
        (<Route path={`${APP_ROOT_URL}/privacy-policy/`} component={PrivacyPolicyPage} key="PrivacyPolicyPage" />),
        (<Route path={`${APP_ROOT_URL}/terms-of-service/`} component={TermsOfServicePage} key="TermsOfServicePage" />), 
        (<Route path={`${APP_ROOT_URL}/invitation/:key`} component={InvitationPage} key="InvitationPage" />),
        (<Route path={`${APP_ROOT_URL}/join-loop/:key`} component={MultiUseInvitationPage} key="MultiUseInvitationPage" />),
        (<Route path={`${APP_ROOT_URL}/register`} component={RegisterPage} key="RegisterPage" />),
        (<Route path={`${APP_ROOT_URL}/how-it-works/`} component={HowItWorksPage} key="HowItWorksPage" />)
      ]

      if(configuration.CURRENT_DEPLOYMENT_ENVIRONMENT === configuration.DEPLOYMENT_ENVIRONMENTS.development) {
        const documentationRoute = (<Route path={`${APP_ROOT_URL}/documentation/`} component={DocumentationPage} key="DocumentationPage"/>);
        publicRoutes.push(documentationRoute);
      }

    return (

      <IntlProvider locale={language}>
          <React.Fragment>
            <TopNavBar />
            <SystemActivityIndicator />
            <Container fluid>
              <div className="o-responsive-page-container o-footer">
                { isUserLoggedIn ? 
                  (
                    <Switch>
                      {authRequiredRoutes}
                      {publicRoutes}
                      <Route render={() => <Redirect to={`${configuration.APP_ROOT_URL}/loop/${loginGroupId}/dashboard/`}/> } />
                    </Switch>
                  ) : 
                  (
                    <Switch>
                      {publicRoutes}
                      <Route path={`${configuration.APP_ROOT_URL}/login/`} component={LoginPage} key="LoginPage"/>
                      <Route path={`${configuration.APP_ROOT_URL}/forgot-password/sent/`} component={ForgotPasswordConfirmPage} key="ForgotPasswordConfirmPage"/>
                      <Route path={`${configuration.APP_ROOT_URL}/forgot-password/`} component={ForgotPasswordPage} key="ForgotPasswordPage"/>
                      <Route path={`${configuration.APP_ROOT_URL}/password-reset/:uid/:token/`} component={ForgotPasswordResetPage} key="ForgotPasswordResetPage"/>
                      <Route path={`${configuration.APP_ROOT_URL}/password-reset/complete/`} component={ForgotPasswordResetCompletePage} key="ForgotPasswordResetCompletePage"/>
                      <Route exact path={`${configuration.APP_ROOT_URL}/`} render={(props) => <LandingPage {...props} isUserLoggedIn={isUserLoggedIn} />} key="LandingPage" />
                      <Route render={() => <Redirect to={`${configuration.APP_ROOT_URL}/login/`}/>} />
                    </Switch>
                  )
                }
              </div>
            </Container>

            <div className="o-tour-hacks">
              <div className="o-tour-hack-create-post-container">
                <div className="o-tour-hack-create-post" />
              </div>
            </div>

            <BottomToolbar isUserLoggedIn={isUserLoggedIn} currentUserId={currentUserId} groupToSetHome={groupToSetHome} />

          </React.Fragment>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => ({
  isUserLoggedIn: isLoggedIn(state),
  hasLoadedAuthToken: (state.user && state.user.authToken !== undefined),
  currentUserId : state.currentUserId,
  state,
  groups: state.groups,
  groupToSetHome: (state.lastVisitedGroupId ? state.lastVisitedGroupId : null)
});

const mapDispatchToProps = dispatch => ({
  dispatchLogNavigationAction: (url) => dispatch(telemetryActions.logNavigationAction(url)),
  dispatchSetLastVisitedGroupId: (groupToChooseId) => dispatch(groupActions.setLastVisitedGroupId(groupToChooseId))
});

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(withRouter(withGoogleAnalytics(App)));

App.propTypes = {
};

const asyncLocalStorage = new AsyncStorage(new StorageStrategyAdapter(localStorage));
const asyncSessionStorage = new AsyncStorage(new StorageStrategyAdapter(sessionStorage));
const storeStorageService = new StoreStorageService(asyncLocalStorage, asyncSessionStorage);

// Register all the mappers we need to expose to fetchResourceMiddleware
const modelMapperService = new ClientServerModelMapperService();

modelMapperService.registerModelMappers(configuration.MODEL_TYPES.category, categoryMappers.fromClientCategoryObject, categoryMappers.fromServerCategoryObject, categoryMappers.fromDeserializedClientCategoryObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.post, postMappers.fromClientPostObject, postMappers.fromServerPostObject, postMappers.fromDeserializedClientPostObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.comment, commentMappers.fromClientCommentObject, commentMappers.fromServerCommentObject, commentMappers.fromDeserializedClientCommentObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.group, loopMappers.fromClientGroupObject, loopMappers.fromServerGroupObject, loopMappers.fromDeserializedClientGroupObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.tag, tagMappers.fromClientTagObject, tagMappers.fromServerTagObject, tagMappers.fromDeserializedClientTagObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.place, placeMappers.fromClientPlaceObject, placeMappers.fromServerPlaceObject, placeMappers.fromDeserializedClientPlaceObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.googlePlace, googlePlaceMappers.fromClientGooglePlaceObject, googlePlaceMappers.fromServerGooglePlaceObject, googlePlaceMappers.fromDeserializedClientGooglePlaceObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.photo, photoMappers.fromClientPhotoObject, photoMappers.fromServerPhotoObject, photoMappers.fromDeserializedClientPhotoObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.user, userMappers.fromClientUserObject, userMappers.fromServerUserObject, userMappers.fromDeserializedClientUserObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.summaryPreference, summaryPreferenceMappers.fromClientSummaryPreferenceObject, summaryPreferenceMappers.fromServerSummaryPreferenceObject, summaryPreferenceMappers.fromDeserializedClientSummaryPreferenceObject);
modelMapperService.registerModelMappers(configuration.MODEL_TYPES.feedback, feedbackMappers.fromClientFeedbackObject);

// WARNING - hard dependency on Google Maps Places API
// eslint-disable-next-line
const googlePlacesService = new GooglePlacesService(google.maps.places);


const fetchStateTracker = new FetchStateTracker(globalAppEventPublisher);

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

const store = 
  createStore(
    reducers, 
    composeEnhancers(
      applyMiddleware(
        thunk, 
        fetchMiddleware(window.fetch, fetchStateTracker),
        fetchResourceMiddleware(modelMapperService, storeStorageService),
        googlePlacesMiddleware(googlePlacesService, storeStorageService),
        userAuthMiddleware(storeStorageService),
        validationMiddleware,
        performanceProfilingMiddleware
        // (
        //   configuration.CURRENT_DEPLOYMENT_ENVIRONMENT === configuration.CURRENT_DEPLOYMENT_ENVIRONMENT.development 
        //   || configuration.CURRENT_DEPLOYMENT_ENVIRONMENT === configuration.CURRENT_DEPLOYMENT_ENVIRONMENT.appDevelopment
        // ) ? performanceProfilingMiddleware : undefined
      )
    )
  );

reduxStoreProvider.setReduxStore(store);
globalGoogleTagService.setStore(store);
// Ask the store to load data from storage
store.dispatch(userAuthActions.loadFromStorage())


/* */
setupHandleNewDashboardPostDataReceivedEvent(store);
globalAppEventPublisher.addEventListener(
  handleNewDashboardPostDataReceivedEvent, 
  SOCKET_IO_EVENTS.posts.dataReceived
);

/**
 * Will hold Socket.IO socket for the '/posts' namespace
 */
let postsSocket;

function joinLoopRooms() {
  const state = store.getState();
  const { currentUserId } = state;
  const currentUser = state.users[currentUserId];
  forEach(currentUser.groups, groupId => {
    postsSocket.emit(SOCKET_IO_EVENTS.posts.joinLoopRoom, groupId);
  });
}

const commandRunner = new CommandRunner({ reduxStore: store, storeStorageService });

// Setup tasks to run on login
globalPostLoginTaskRunner.addTaskBatch([
  {
    func: () => commandRunner.runNewCommands(),
    isBlocking: true
  },
  {
    /**
     * Fetch the current user's profile
     */
    func: () => store.dispatch(userActions.getCurrentUser()),
    isBlocking: true 
  },
  {
    /**
     * Fetch the current user's groups
     */
    func: () => store.dispatch(groupActions.fetchGroups()),
    isBlocking: true 
  },
  {
    /**
     * Fetch the current user's memberships
     */
    func: () => store.dispatch(membershipActions.fetchMembershipsForUser(store.getState().currentUserId)),
    isBlocking: true
  },
  {
    /**
     * Fetch the most recent list of categories for the site
     */
    func: () => store.dispatch(categoryActions.fetchCategories())
  },
  {
    /**
     * Redirect to the default loop if logged in and at '/'
     */
    func: () => {
      const state = store.getState();
      const { groups } = state;
      if(Object.keys(groups).length > 0) {
        const keys = Object.keys(groups);
        let groupToChoose = groups[keys[0]];

        if(groupToChoose && !groupToChoose.id) {
          if(groupToChoose === BOVIK_GROUP_ID) {
            if(groups[keys[1]]){
              groupToChoose = groups[keys[1]];
            }
          }
          
          store.dispatch(groupActions.setLastVisitedGroupId(groupToChoose));     
        }

        if(groupToChoose.id === BOVIK_GROUP_ID) {
          groupToChoose = groups[keys[1]];
        }
        
        store.dispatch(groupActions.setLastVisitedGroupId(groupToChoose.id));        
      }
    },
    isBlocking: true
  }, 
  {
    /**
     * Setup push jobs 
     */
    func: () => {
      // Start listening to all the correct loops;
      const address = `${configuration.SOCKET_IO_SERVER_HOST}:${configuration.SOCKET_IO_SERVER_PORT}/posts`;
      postsSocket = socketIOClient(address);
      registerNewPostMessageReceiver(postsSocket, store, storeStorageService, console, globalAppEventPublisher);
      joinLoopRooms();

      postsSocket.on('reconnect', joinLoopRooms);
    }
  } 
]);


// Setup tasks to run on login
globalPostLoginTaskRunner.addLoggedOutTaskBatch([{
  /**
   * Stop simulated push jobs
   */
  func: () => {
    if(postsSocket) {
      postsSocket.disconnect();
      postsSocket = undefined;
    }
  }
}])


// Wire up the application
// eslint-disable-next-line
export function startApp() {
  const wrapper = document.getElementById('app');
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Route path={configuration.APP_ROOT_URL} component={ConnectedApp} />
      </BrowserRouter>
    </Provider>,
    wrapper
  );
}

