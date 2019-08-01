import React from 'react';
import { connect } from 'react-redux';
import { HashLink as Link } from 'react-router-hash-link';

import configuration from '../../configuration';
import PageInitializer from '../PageInitializer';
import Page from '../Page';

import './NotificationsPage.scss';

const NotificationsPage = ({currentUserId}) => (
  <PageInitializer>
    <Page className="o-notifications-page">
      <h2 className="o-helpful-text">
      In-app notifications coming soon.
      </h2>
      <Link 
        to={`${configuration.APP_ROOT_URL}/users/${currentUserId}/settings#account-settings`} 
        className="o-settings-link">Manage your email and text notification settings
      </Link>
    </Page>
  </PageInitializer>
);

const mapStateToProps = (state) => {
  const { currentUserId } = state;
  return { currentUserId };
};

export default connect(mapStateToProps)(NotificationsPage);