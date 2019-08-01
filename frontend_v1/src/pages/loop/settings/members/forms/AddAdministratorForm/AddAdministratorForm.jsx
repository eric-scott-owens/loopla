import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';



import { addLoopAdministrator } from '../../../../../../containers/loops/memberships/addAdministrator/actions';
import { newKeyFor } from '../../../../../../utilities/ObjectUtilities';
import AutoForm from '../../../../../../components/AutoForm'
import TextField from '../../../../../../components/form-controls/TextField';
import TextArea from '../../../../../../components/form-controls/TextArea';
import SuccessMessage from '../../../../../../components/SuccessMessage';
import AddAdministratorFormValidator from '../../../../../../containers/loops/memberships/addAdministrator/validator';

const validator =new AddAdministratorFormValidator();

class AddAdministratorForm extends React.Component {
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

  render() {
    const { data, className, dispatchAddLoopAdministrator } = this.props;

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
        processingHandler={dispatchAddLoopAdministrator}
        onProcessingComplete={this.onProcessingComplete}
        onCancel={this.onCancel}
        validator={validator}
      >
        <div className="o-modal-form-heading">1. Provide contact info</div>
        <Row className="form-row">
          <Col md="4" className="o-invitee-first-name">
            <TextField 
              valuePath="invitee.firstName"
              placeholder="First Name*" />
          </Col>
          <Col md="4" className="o-invitee-last-name">
            <TextField 
              valuePath="invitee.lastName"
              placeholder="Last Name*" />
          </Col>
          <Col md="4" className="o-invitee-email">
            <TextField 
              valuePath="invitee.email"
              placeholder="Email*" />
          </Col>
        </Row>
        
        <div className="o-modal-form-heading">2. Personalize the email invitation</div>   
        <Row>
          <Col>
          <TextArea
              placeholder="Add optional note"
              valuePath="message" />
          </Col>
        </Row> 

      </AutoForm>
    );
  }
}


AddAdministratorForm.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line
  loopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCancel: PropTypes.func,
  onProcessingComplete: PropTypes.func,
  onDismissSuccessMessage: PropTypes.func
}

const mapStateToProps = (state, props) => {
  const { loopId } = props;
  const model = 'add-new-administrator-form';
  const data = { 
    id: newKeyFor(model, { loopId }),
    model,
    invitee: {
      email: '',
      firstName: '',
      lastName: ''
    },
    message: '',
    loopId
  };

  const editingObject = state.editingObjects[data.id];

  return { data, editingObject };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchAddLoopAdministrator: (request) => dispatch(addLoopAdministrator(request))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAdministratorForm);