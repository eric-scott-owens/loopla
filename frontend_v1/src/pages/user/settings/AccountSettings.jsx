import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import forEach from 'lodash/forEach';
import configuration from '../../../configuration';
import { newKeyFor } from '../../../utilities/ObjectUtilities';
import * as userActions from '../../../containers/users/actions';
import * as editingActions from '../../../actions/editingObjects';
import * as preferenceActions from '../../../containers/users/summaryPreferences/preferenceActions';
import { getUserProfileUrl } from '../../../utilities/UrlUtilities';
import { navigateBackTo } from '../../../containers/history/AppNavigationHistoryService';

import Page from '../../Page';
import Error403 from '../../error/403';
import Toggle from '../../../components/form-controls/Toggle';
import ChangePasswordForm from '../../../components/ChangePasswordForm';

import './AccountSettings.scss';

class AccountSettings extends React.Component {
  componentDidMount () {
    if(
      !this.props.user &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.user)
    ) {
      const userId = this.props.id;
      this.props.dispatchFetchUser(userId);
      this.props.dispatchFetchSummaryPreferencesForUser(userId);
    }
    this.props.dispatchFetchSummaryPreferencesForUser(this.props.user.id);

  }

  onUserFieldValueUpdate = async (fieldName, fieldValue) => {
    const { user } = this.props;
    const updatedUser = { ...user };
    updatedUser[fieldName] = fieldValue; 

    try {
      await this.props.dispatchUpdateUser(updatedUser);
    } catch(error) {
      // Something
    }
  }

  onSummaryPreferenceFieldValueUpdate = async (fieldName, fieldValue) => {
    const { preferences, user } = this.props;

    const updatedPreferences = {};

    forEach(preferences, (pref, key) => { 
      const tempPref = {...pref};
      tempPref[fieldName] = fieldValue;
      updatedPreferences[key] = tempPref;
    });

  
    try {
      await this.props.dispatchUpdatePreferences(user.id, updatedPreferences);
    } catch(error) {
      // Something
    }
  }

  onCancel = () => {
    const { user } = this.props;
    navigateBackTo(getUserProfileUrl(user.id));
  }

  render() {
    const { user, isCurrentUsersPage, preferences } = this.props;
    if (!user) {
      return "Loading...";
    }

    this.showPrefs = {
      sendDailySummary: false,
      sendWeeklySummary: false
    }

    if(preferences.length > 0) {
      this.showPrefs = preferences[0];
    }

    if(!isCurrentUsersPage) {
      return <Error403/>;
    }

    return (
      <Page className="o-user-account-settings o-space-bottom-normal">
        <React.Fragment>
          
          <a id="account-settings">
            <h1 className="text-center o-space-top-normal">Account Settings</h1>
          </a>
          
          <div className="o-m-top-normal o-m-bottom-normal">
            <h2>Privacy Settings </h2>
            <p>By default, your personal information is kept private. To share your personal information with your loops, change your preferences below.</p>

            <Toggle 
              value={user.isShareEmail} 
              onChange={(value) => this.onUserFieldValueUpdate('isShareEmail', value)}
              label="Share my email"
              />
            <Toggle 
              value={user.isSharePhone} 
              onChange={(value) => this.onUserFieldValueUpdate('isSharePhone', value)} 
              label="Share my phone number"
              />
            <Toggle 
              value={user.isShareAddress} 
              onChange={(value) => this.onUserFieldValueUpdate('isShareAddress', value)} 
              label="Share my address"
              />
          </div>

          <div className="o-m-bottom-normal">
            <h2>Notification Settings</h2>
            <p>We can notify you when someone in your loop shares a new post or comments on a post you have contributed to. Select how you would like to receive those updates.</p>

            <Toggle 
              value={user.notifyByEmail} 
              onChange={(value) => this.onUserFieldValueUpdate('notifyByEmail' , value)} 
              label="Send notifications by email"
              />
            <Toggle 
              value={user.notifyByText} 
              onChange={(value) => this.onUserFieldValueUpdate('notifyByText' , value)} 
              label="Send notifications by text"
              />
          </div>

      
          <div className="o-m-bottom-normal">
            <h2>Subscribe to Email Summaries</h2>
            <p>Receive a daily or weekly email summarizing posts and comments made within your loops. Subscribe here to stay in the loop.</p> 

            <Toggle 
              value={this.showPrefs.sendDailySummary} 
              onChange={(value) => this.onSummaryPreferenceFieldValueUpdate('sendDailySummary' , value)} 
              label="Send daily summary"
              />
            <Toggle 
              value={this.showPrefs.sendWeeklySummary} 
              onChange={(value) => this.onSummaryPreferenceFieldValueUpdate('sendWeeklySummary', value)} 
              label="Send weekly summary"
              />
          </div>
          

          <div className="o-m-bottom-normal">
            <h2>Change Password</h2>
            <p>8 character minimum</p>
            <Row>
              <Col md="6">
                <ChangePasswordForm userId={user.id} />
              </Col>
            </Row>  
          </div>

        </React.Fragment>
      </Page>
    );
  }
}

AccountSettings.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state, props) => {
  let { user } = props;
  if(!user) {
    if(props.id) user = state.users[props.id];
    else throw new Error("CRITICAL: Cannot load user. An id must be provided");
  }

  const { currentUserId } = state;

  const isCurrentUsersPage = (user && (currentUserId === user.id));

  const preferences = [];

  forEach(state.summaryPreferences, pref => {
    if (pref.userId === currentUserId) {
      preferences.push(pref);
    }
  });

  return { user, currentUserId, isCurrentUsersPage, preferences };
}

const mapDispatchToProps = dispatch => ({
  dispatchAddEditingObject: (user) => dispatch(editingActions.addEditingObject(user)),
  dispatchFetchUser: (userId) => dispatch(userActions.fetchUser(userId)),
  dispatchUpdateEditingObjectField: (userId, fieldName, fieldValue) => dispatch(editingActions.updateEditingObjectField(userId, fieldName, fieldValue)),
  dispatchRemoveEditingObject: (userId) => dispatch(editingActions.removeEditingObject(userId)),
  dispatchUpdateUser: (updatedUser) => dispatch(userActions.updateUser(updatedUser)),
  dispatchFetchSummaryPreferencesForUser: (userId) => dispatch(preferenceActions.fetchSummaryPreferencesForUser(userId)),
  dispatchUpdatePreferences: (userId, updatedPreferences) => dispatch(preferenceActions.updateSummaryPreferences(userId, updatedPreferences)),

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountSettings));