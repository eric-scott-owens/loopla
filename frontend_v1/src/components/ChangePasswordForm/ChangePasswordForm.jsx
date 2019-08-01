import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { removeEditingObject } from '../../actions/editingObjects/editingObjects';
import { changePassword } from '../../containers/users/changePassword/ChangePasswordActions';
import AutoForm from '../AutoForm';
import PasswordField from '../form-controls/PasswordField';
import ChangePasswordFormValidator from '../../containers/users/changePassword/ChangePasswordFormValidator';
import SuccessMessage from '../SuccessMessage';

const validator = new ChangePasswordFormValidator();

const emptyFormData = {
  model: 'CHANGE-PASSWORD-FORM',
  id: 'CHANGE-PASSWORD-FORM',
  userId: null,
  oldPassword: '',
  newPassword: '',
  retypePassword: ''
};


class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorModal: false,
      showSuccessModal: false,
    };
  }

  onProcessingComplete = () => {
    this.toggleSuccessModal();
  }

  getProcessingButtonText = (formData, props, isProcessing) => isProcessing ? 'Updating...' : 'Change Password';
  

  toggleErrorModal = () => {
    this.setState(state => ({ showErrorModal: !state.showErrorModal }));
  }

  toggleSuccessModal = () => {
    this.setState(state => ({ showSuccessModal: !state.showSuccessModal }));
  }

  render() {
    const { formData } = this.props; 
    const { showErrorModal, showSuccessModal } = this.state;

    return (
      <AutoForm 
        data={formData}
        validator={validator}
        processingHandler={this.props.dispatchChangePassword}
        onProcessingComplete={this.onProcessingComplete}
        onProcessingFailure={this.toggleErrorModal}
        processingButtonText={this.getProcessingButtonText}
        resetEditingObjectAfterProcessing
        processingButtonClassName="btn-sm"
        toolbarAlign="left"
      >
        <PasswordField 
          valuePath="oldPassword" 
          placeholder="Current password*" />
        <PasswordField 
          valuePath="newPassword" 
          placeholder="New password*" />
        <PasswordField 
          valuePath="retypePassword" 
          placeholder="Retype password*" />

        <Modal
          isOpen={showErrorModal}
          toggle={this.toggleErrorModal}>
          <ModalHeader toggle={this.toggleErrorModal}>Error</ModalHeader>
          <ModalBody>
            <SuccessMessage onDismiss={this.toggleErrorModal}>
              There was an error updating your password. Please try again.
            </SuccessMessage>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={showSuccessModal}
          toggle={this.toggleSuccessModal}>
          <ModalHeader toggle={this.toggleSuccessModal}>Success</ModalHeader>
          <ModalBody>
            <SuccessMessage onDismiss={this.toggleSuccessModal}>
              Your password has been updated.
            </SuccessMessage>  
          </ModalBody>
        </Modal>
      </AutoForm>
    );

  }

}

ChangePasswordForm.propTypes = {
  // eslint-disable-next-line
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

const mapStateToProps = (state, props) => {
  const { userId } = props;
  const formData = {...emptyFormData, userId } ;
  return { formData };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchChangePassword: (formData) => dispatch(changePassword(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);