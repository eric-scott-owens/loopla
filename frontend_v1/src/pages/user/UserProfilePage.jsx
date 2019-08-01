import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import UserProfile from './UserProfile'
import PageInitializer from '../PageInitializer';

import './UserProfilePage.scss';

const UserProfilePage = (props) => {
  const { match } = props;
  const userID = parseInt(get(match, 'params.id'), 10);

  return (
    <PageInitializer>
      <UserProfile id={userID} />
    </PageInitializer>
  );
}

UserProfilePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired
  }).isRequired
};

export default withRouter(UserProfilePage);