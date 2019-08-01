import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import UserSettings from './UserSettings'
import PageInitializer from '../../PageInitializer';


const UserSettingsPage = (props) => {
  const { match } = props;
  const userID = parseInt(get(match, 'params.id'), 10);

  return ( 
    <PageInitializer>
      <UserSettings id={userID} />
    </PageInitializer>
  );
}

UserSettingsPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired
  }).isRequired
};

export default withRouter(UserSettingsPage);