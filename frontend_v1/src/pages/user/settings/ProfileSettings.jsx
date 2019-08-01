import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import configuration from '../../../configuration';
import * as userActions from '../../../containers/users/actions';
import  * as postActions from '../../../containers/posts/actions';
import * as commentActions from '../../../containers/comments/actions';
import { getUserProfileUrl } from '../../../utilities/UrlUtilities';
import { navigateBackTo } from '../../../containers/history/AppNavigationHistoryService';
import * as validationActions from '../../../actions/validation';
import * as editingActions from '../../../actions/editingObjects';

import Page from '../../Page';
import Error403 from '../../error/403';
import PageBackButton from '../../../components/PageBackButton';
import PhoneNumberField from '../../../components/form-controls/PhoneNumberField';
import TextField from '../../../components/form-controls/TextField';
import ProfilePhotoUploader from '../../../components/form-controls/ProfilePhotoUploader';
import AutoForm from '../../../components/AutoForm';
import UserDisplayName from '../../../components/UserDisplayName';
import StateSelector from '../../../components/form-controls/StateSelector';


import UserValidator from '../../../containers/users/edit/validator';

import "./ProfileSettings.scss";
import TextArea from '../../../components/form-controls/TextArea';
import { update } from 'immutable';

const validator = new UserValidator();

class ProfileSettings extends React.Component {

  componentWillUnmount() {
    const userId = this.props.id;
    this.props.dispatchRemoveEditingObject(userId);
  }

  onFieldValueUpdate = (fieldName, fieldValue) => {
    const { user } = this.props;
    this.props.dispatchUpdateEditingObjectField(user.id, fieldName, fieldValue);
    this.props.dispatchValidateUser(this.props.id);
  }

  onCancel = () => {
    const { user } = this.props;
    navigateBackTo(getUserProfileUrl(user.id));
  }

  onSaveComplete = () => {
    const { user }  = this.props;
    navigateBackTo(getUserProfileUrl(user.id));
  }

  onSave = (user) => {
    const updatedUser = {};
    updatedUser.id = user.id;
    updatedUser.model = user.model;
    updatedUser.firstName = user.firstName;
    updatedUser.lastName = user.lastName;
    updatedUser.middleName = user.middleName;
    updatedUser.biography = user.biography;
    updatedUser.addressLine1 = user.addressLine1;
    updatedUser.addressLine2 = user.addressLine2;
    updatedUser.city = user.city;
    updatedUser.state = user.state;
    updatedUser.zipcode = user.zipcode;
    updatedUser.telephoneNumber = user.telephoneNumber;
    updatedUser.email = user.email;
    updatedUser.photo = user.photo;
    this.props.dispatchUpdateUser(updatedUser);
  }

  render() {
    const { user, isCurrentUsersPage } = this.props;

    if (!user) {
      return "Loading...";
    }

    if(!isCurrentUsersPage) {
      return <Error403/>;
    }

    return (
      <Page className="o-user-profile-editor">

        <PageBackButton backTo={getUserProfileUrl(user.id)}>
          <UserDisplayName id={user.id} dontLinkToProfile />
        </PageBackButton>
        
        <h1 className="text-center">Edit Your Profile</h1>

        <AutoForm
          className="o-user-profile-editor"
          data={user}
          processingHandler={this.onSave}
          onProcessingComplete={this.onSaveComplete}
          onCancel={this.onCancel}
          validator={validator}
          processingButtonText = "Save"
          >

          <ProfilePhotoUploader valuePath="photo" />

          <Row className="o-section-space-md form-row">
            <Col sm="4">
              {/* First Name:  */}
              <TextField
              className="o-user-first-name"
              placeholder="First Name"
              valuePath="firstName" />
            </Col>

            <Col sm="4">
              {/* Middle Name:  */}
              <TextField
              placeholder="Middle Name"
              valuePath="middleName" />
            </Col>

            <Col sm="4">
              {/* Last Name:  */}
              <TextField
              placeholder="Last Name"
              valuePath="lastName" />
            </Col>
          </Row>

          <Row className="o-section-space-md form-row">
            <Col sm="12">
              {/* Biography:  */}
              <TextArea
              placeholder="Bio"
              valuePath="biography" />
            </Col>
          </Row>

          <Row className="o-section-space-md form-row">

            <Col sm="12">
              <TextField
              className="o-user-address-1"
              placeholder="Address 1"
              valuePath="addressLine1"
              />
            </Col>

            <Col sm="12">
              <TextField
              className="o-user-address-2"
              placeholder="Address 2"
              valuePath="addressLine2"
              />
            </Col>

            <Col sm="6">
              {/* City: */}
              <TextField
              className="o-user-city"
              placeholder="City"
              valuePath="city" />
            </Col>

            <Col sm="3">
              {/* State: */}
              <StateSelector
              className="o-user-state"
              placeholder="State"
              valuePath="state" />
            </Col>

            <Col sm="3">
              {/* Zip Code: */}
              <TextField
              className="o-user-zipcode"
              placeholder="Zip Code"
              valuePath="zipcode" />
            </Col>
          </Row>
          <Row className="o-section-space-md form-row">
            <Col sm="6">
              {/* Phone Number: */}
              <PhoneNumberField 
              className="o-user-phone-number"
              placeholder="Phone Number"
              valuePath="telephoneNumber" />
            </Col>

            <Col sm="6">
              {/* Email: */}
              <TextField
              className="o-user-email"
              placeholder="Email"
              valuePath="email" />
            </Col>
          </Row>
        </AutoForm>

      </Page>
    );
  }
}

ProfileSettings.propTypes = {
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

  return { user, currentUserId, isCurrentUsersPage };
}

const mapDispatchToProps = dispatch => ({
  dispatchAddEditingObject: (user) => dispatch(editingActions.addEditingObject(user)),
  dispatchFetchUser: (userId) => dispatch(userActions.fetchUser(userId)),
  dispatchFetchPostCountForUser: (userId) => dispatch(postActions.fetchPostCountForUser(userId)),
  dispatchFetchKudosForUser: (userId) => dispatch(userActions.fetchKudosForUser(userId)),
  dispatchFetchCommentCountForUser: (userId) => dispatch(commentActions.fetchCommentCountForUser(userId)),
  dispatchUpdateEditingObjectField: (userId, fieldName, fieldValue) => dispatch(editingActions.updateEditingObjectField(userId, fieldName, fieldValue)),
  dispatchRemoveEditingObject: (userId) => dispatch(editingActions.removeEditingObject(userId)),
  dispatchValidateUser: (userId) => dispatch(validationActions.validate(configuration.MODEL_TYPES.user, userId)),
  dispatchRemoveValidation: (postId) => dispatch(validationActions.removeValidation(postId)), 
  dispatchUpdateUser: (updatedUser) => dispatch(userActions.updateUser(updatedUser))

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileSettings));