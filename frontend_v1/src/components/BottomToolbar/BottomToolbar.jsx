import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Home from '@material-ui/icons/Home';
import Search from '@material-ui/icons/Search';
import Notifications from '@material-ui/icons/Notifications';
import AddCircle from '@material-ui/icons/AddCircle';
import AccountCircle from '@material-ui/icons/AccountCircle';

import configuration from '../../configuration';
import { getLoopDashboardUrl, getUserProfileUrl } from '../../utilities/UrlUtilities';

import Toolbar from '../Toolbar';
import IconButton from '../IconButton';

import './BottomToolbar.scss';

const BottomToolbar = (props) => {
  const { isUserLoggedIn, currentUserId, groupToSetHome, location } = props;
  if(!isUserLoggedIn) return null;

  const { APP_ROOT_URL, APP_SEARCH_URL } = configuration;
  const { pathname } = location;
  
  const loopDashboardUrl = getLoopDashboardUrl(groupToSetHome)
  const newPostUrl = `${APP_ROOT_URL}/posts/new`;
  const notificationsUrl = `${APP_ROOT_URL}/notifications`;
  const userProfileUrl = getUserProfileUrl(currentUserId);

  const isHomeButtonActive = (pathname.indexOf(loopDashboardUrl) === 0);
  const isSearchButtonActive = (pathname.indexOf(APP_SEARCH_URL) === 0);
  const isNewPostButtonActive = (pathname.indexOf(newPostUrl) === 0);
  const isNotificationsButtonActive = (pathname.indexOf(notificationsUrl) === 0);
  const isUserProfileButtonActive = (pathname.indexOf(userProfileUrl) === 0);

  return (
    <Toolbar className="o-bottom-toolbar d-md-none" side="bottom" position="fixed" textAlign="center">
      <div className="o-mobile-nav">
        <IconButton linkTo={loopDashboardUrl} isActive={isHomeButtonActive} ><Home /></IconButton>
        <IconButton linkTo={APP_SEARCH_URL} isActive={isSearchButtonActive} ><Search /></IconButton>
        <IconButton linkTo={newPostUrl} className="o-add-post-icon" isActive={isNewPostButtonActive} ><AddCircle /></IconButton>
        <IconButton linkTo={notificationsUrl} isActive={isNotificationsButtonActive} ><Notifications/></IconButton>
        <IconButton linkTo={userProfileUrl} isActive={isUserProfileButtonActive} ><AccountCircle/></IconButton>
      </div>
  </Toolbar>
  );
}


BottomToolbar.propTypes = {
  isUserLoggedIn: PropTypes.bool,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  groupToSetHome: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withRouter(BottomToolbar);