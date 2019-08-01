import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { newKeyFor } from '../../../../../../utilities/ObjectUtilities';
import UserDisplayName from '../../../../../../components/UserDisplayName';
import AutoForm from '../../../../../../components/AutoForm';
import RadioGroup from '../../../../../../components/form-controls/RadioGroup';
import Toggle from '../../../../../../components/form-controls/Toggle';
import TextArea from '../../../../../../components/form-controls/TextArea';
import SuccessMessage from '../../../../../../components/SuccessMessage';

import AdminToMemberEmailPreview from './email-previews/AdminToMember';
import AdminToInactiveEmailPreview from './email-previews/AdminToInactive';
import RemoveAdminEmailPreview from './email-previews/RemoveAdmin';
import MemberToAdminEmailPreview from './email-previews/MemberToAdmin';
import MemberToInactiveEmailPreview from './email-previews/MemberToInactive';
import RemoveMemberEmailPreview from './email-previews/RemoveMember';
import InactiveToMemberEmailPreview from './email-previews/InactiveToMember';
import RemoveInactiveEmailPreview from './email-previews/RemoveInactive';

import { updateEditingObjectField } from '../../../../../../actions/editingObjects';
import { changeMembershipStatus } from '../../../../../../containers/loops/memberships/changeMembershipStatus/actions';
import { getMembershipType } from '../../../../../../containers/loops/memberships/MembershipTypeEnum';
import StatusChangeOptionsEnum from '../../../../../../containers/loops/memberships/changeMembershipStatus/StatusChangeOptionsEnum';
import statusChangeRadioOptions, { getStatusChangeRadioOptionConfigByValue } from './statusChangeRadioOptions';
import ChangeMembershipStatusFormValidator from '../../../../../../containers/loops/memberships/changeMembershipStatus/validation/validator';

import './ChangeMembershipStatusForm.scss';

const validator = new ChangeMembershipStatusFormValidator();

class ChangeMembershipStatusForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCompleted: false
    }
  }

  onCancel = () => {
    if(this.props.onCancel) {
      this.props.onCancel();
    }
  }

  onProcessingComplete = (editingObject, props) => {
    this.setState({hasCompleted: true});
    if(this.props.onProcessingComplete) {
      this.props.onProcessingComplete(editingObject, props);
    }
  }

  onDismissSuccessMessage = () => {
    if(this.props.onDismissSuccessMessage) {
      this.props.onDismissSuccessMessage();
    }
  }

  onFieldValueUpdateComplete = (valuePath, value) => {
    if(valuePath === 'changeStatusType') {
      const radioOptionConfig = getStatusChangeRadioOptionConfigByValue(value);  
      if(radioOptionConfig.isEmailRequired) {
        this.props.dispatchSetShouldSendMessageFlag(this.props.changeRequest, true);
      }
    }
  }

  /** Determines if the should send email toggle should be disabled given the current context
   * @function
   */
  getDisableEmailToggleValue = () => {
    const { editingObject } = this.props;

    // If we have selected an option that requires an email be sent... 
    if(editingObject && editingObject.changeStatusType) {
      const radioOptionConfig = getStatusChangeRadioOptionConfigByValue(editingObject.changeStatusType);  
      if(radioOptionConfig.isEmailRequired) {
        // disable the toggle
        return true;
      }
    }

    return false; // Typically no need to disable the toggle
  }

  render() {
    const { membership, user, changeRequest, className, editingObject, dispatchChangeMembershipStatus } = this.props;
    const disableEmailToggle = this.getDisableEmailToggleValue();

    if(this.state.hasCompleted) {
      return (
        <SuccessMessage onDismiss={this.onDismissSuccessMessage} />
      );
    }

    return(
      <AutoForm
        data={changeRequest}
        className={`o-change-membership-status-form ${className}`}
        processingHandler={dispatchChangeMembershipStatus}
        onFieldValueUpdateComplete={this.onFieldValueUpdateComplete}
        onProcessingComplete={this.onProcessingComplete}
        onCancel={this.onCancel}
        validator={validator}
      >
        
        <RadioGroup
          name="status-options"
          options={statusChangeRadioOptions.filter(option => option.for === getMembershipType(membership))}
          valuePath="changeStatusType" />

        <Toggle valuePath="shouldSendMessage" disabled={disableEmailToggle}> 
          <React.Fragment>
            Send the following email to {' '} 
            <UserDisplayName id={membership.userId} dontLinkToProfile showFirstNameOnly />
          </React.Fragment>
        </Toggle>

        <div className={`o-status-email-preview ${ editingObject && editingObject.shouldSendMessage ? '' : 'disabled'}`}>

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.ADMIN_TO_MEMBER && (
            <AdminToMemberEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </AdminToMemberEmailPreview>
          )}

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.ADMIN_TO_INACTIVE && (
            <AdminToInactiveEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </AdminToInactiveEmailPreview>
          )}

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.REMOVE_ADMIN && (
            <RemoveAdminEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </RemoveAdminEmailPreview>
          )}

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.MEMBER_TO_ADMIN && (
            <MemberToAdminEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </MemberToAdminEmailPreview>
          )}

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.MEMBER_TO_INACTIVE && (
            <MemberToInactiveEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </MemberToInactiveEmailPreview>
          )}

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.REMOVE_MEMBER && (
            <RemoveMemberEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </RemoveMemberEmailPreview>
          )}

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.INACTIVE_TO_MEMBER && (
            <InactiveToMemberEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </InactiveToMemberEmailPreview>
          )}

          {editingObject && editingObject.changeStatusType === StatusChangeOptionsEnum.REMOVE_INACTIVE && (
            <RemoveInactiveEmailPreview loopId={changeRequest.loopId} invitee={user}>
              <TextArea
                placeholder="Add optional note"
                valuePath="message"
                disabled={!editingObject.shouldSendMessage} />
            </RemoveInactiveEmailPreview>
          )}

        </div>

      </AutoForm>
    );
  }
}

ChangeMembershipStatusForm.propTypes = {
  // eslint-disable-next-line
  loopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  // eslint-disable-next-line
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  // eslint-disable-next-line
  membershipId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCancel: PropTypes.func,
  onProcessingComplete: PropTypes.func,
  onDismissSuccessMessage: PropTypes.func,
  className: PropTypes.string
}

const mapStateToProps = (state, props) => {
  const { loopId, userId, membershipId } = props;
  const loop = state.groups[loopId];
  const membership = state.memberships[membershipId];
  const user = state.users[userId];
  const model = 'loop-membership-change-status-request';
  const changeRequest = {
    id: newKeyFor(model, { loopId, userId, membershipId, }),
    model,
    changeStatusType: statusChangeRadioOptions.filter(option => option.for === getMembershipType(membership))[0].value,
    loopId,
    userId,
    shouldSendMessage: true,
    message: ''
  }

  const editingObject = state.editingObjects[changeRequest.id];

  return { loop, membership, user, changeRequest, editingObject };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchSetShouldSendMessageFlag: (changeRequest, shouldSendMessage) => dispatch(updateEditingObjectField(changeRequest.id, 'shouldSendMessage', shouldSendMessage)),
  dispatchChangeMembershipStatus: (changeRequest) => dispatch(changeMembershipStatus(changeRequest))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeMembershipStatusForm);