import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { newKeyFor } from '../../../../../../utilities/ObjectUtilities';
import { addLoopMembers, addInviteeRowToForm } from '../../../../../../containers/loops/memberships/addMemberships/actions';
import AutoForm from '../../../../../../components/AutoForm'
import RepeatingFormSection from '../../../../../../components/AutoForm/RepeatingFormSection';
import TextField from '../../../../../../components/form-controls/TextField';
import TextArea from '../../../../../../components/form-controls/TextArea';
import SuccessMessage from '../../../../../../components/SuccessMessage';
import AddMemberFormValidator from '../../../../../../containers/loops/memberships/addMemberships/validator';

import './AddMemberForm.scss';

const validator = new AddMemberFormValidator();

class AddMemberForm extends React.Component {
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

  onAddRow = () => {
    this.props.dispatchAddRow(this.props.data)
  }

  render() {
    const { data, className, dispatchAddLoopMembers } = this.props;

    if(this.state.hasCompleted) {
      return (
        <SuccessMessage onDismiss={this.onDismissSuccessMessage}>
          <h1>Your invitation has been sent!</h1>
        </SuccessMessage>
      );
    }

    return (
      <AutoForm
        data={data}
        className={className}
        processingHandler={dispatchAddLoopMembers}
        onProcessingComplete={this.onProcessingComplete}
        onCancel={this.onCancel}
        validator={validator}
      >
        <div className="o-modal-form-heading">1. Keep a tight loop</div>
        <p>Limit to people who know each other</p>
        <RepeatingFormSection 
          className="o-loop-member-invitees"
          valuePath="invitees"
          onAddRowValueProvider={() => ({ email: '', firstName: '', lastName: ''})}
          onAddRowButtonText="Invite more people">
          <Row className="form-row">
            <Col md="4" className="o-invitee-first-name">
              <TextField 
                valuePath="firstName"
                placeholder="First Name*" />
            </Col>
            <Col md="4" className="o-invitee-last-name">
              <TextField 
                valuePath="lastName"
                placeholder="Last Name*" />
            </Col>
            <Col md="4" className="o-invitee-email">
              <TextField 
                valuePath="email"
                placeholder="Email*" />
            </Col>
          </Row>     
        </RepeatingFormSection>

        <div className="o-modal-form-heading">2. Personalize the email invitation</div>
        <Row>
          <Col>
          <TextArea 
            valuePath="message"
            placeholder="Add optional note" />
          </Col>
        </Row> 

      </AutoForm>
    );
  }
}


AddMemberForm.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line
  loopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCancel: PropTypes.func,
  onProcessingComplete: PropTypes.func,
  onDismissSuccessMessage: PropTypes.func
}

const mapStateToProps = (state, props) => {
  const { loopId } = props;
  const model = 'add-new-user-form';
  const data = { 
    id: newKeyFor(model, { loopId }),
    model,
    invitees: [{
      email: '',
      firstName: '',
      lastName: ''
    }],
    message: '',
    loopId
  };
  return { data };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchAddRow: (editingObject) => dispatch(addInviteeRowToForm(editingObject.id)),
  dispatchAddLoopMembers: (request) => dispatch(addLoopMembers(request))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMemberForm);