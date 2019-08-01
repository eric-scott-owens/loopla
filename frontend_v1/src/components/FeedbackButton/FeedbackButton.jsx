import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import configuration from '../../configuration';
import PhotoGalleryBuilder from '../form-controls/PhotoGalleryBuilder';
import * as actions from '../../containers/feedback/actions';
import FeedbackValidator from '../../containers/feedback/validator';
import TextArea from '../form-controls/TextArea';
import { getBlankModelFor, newKeyFor } from '../../utilities/ObjectUtilities';
import AutoForm from '../AutoForm';
import BasicButton from '../BasicButton'

import './FeedbackButton.scss';


const validator = new FeedbackValidator();
const newFeedbackPrefix = newKeyFor(configuration.MODEL_TYPES.feedback);
class FeedbackButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  toggleModal = () => {
    if(this.props.onClick) {
      this.props.onClick();
    }

    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen
    }));
  }

  submitFeedback = (feedback) => {
    // eslint-disable-next-line no-param-reassign
    feedback.ownerId = this.props.currentUserId
    this.props.dispatchSubmitFeedback(feedback)
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen
    }));
  }

  render() {
  const { className, feedback } = this.props;
  return (
    <span>
      <BasicButton type="button" color="link" className={`o-feedback-button ${className}`} onClick={this.toggleModal}>
        Give Us Feedback
      </BasicButton>

      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} className="o-feedback-modal">
        <ModalHeader toggle={this.toggleModal}>Send us feedback</ModalHeader>
          <ModalBody className="text-center">
            <div className="o-feedback-text">Share your comments, complaints and suggestions here.</div>
            <div className="o-feedback-text-sm">Upload screenshots if you want to show an example of your issue.</div>

            <AutoForm 
            data={feedback}
            processingHandler={this.submitFeedback}
            onRemoveEditingObjectComplete={this.onRemoveEditingObjectComplete}
            onCancel={this.props.toggleModal}
            validator={validator}
            >
          
              <TextArea
                valuePath="text"
                placeholder="Feedback*"
                rows="1"
                 />

              <PhotoGalleryBuilder 
                valuePath="photoCollections[0]"
                canDelete />

            </AutoForm>

          </ModalBody>
      </Modal>
    </span>
   
  );
  }
}

FeedbackButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string
}

const mapStateToProps = (state, props) => {
  let { feedback } = props;
  if(!feedback) {
      feedback = { 
        ...getBlankModelFor( configuration.MODEL_TYPES.feedback )
      };
    }

  const feedbackId = feedback ? feedback.id : props.id;
  const isNewFeedback = feedback ? `${feedback.id}`.indexOf(newFeedbackPrefix) === 0 : false;

  if (state.editingObjects[feedbackId]){
    feedback = state.editingObjects[feedbackId];
  }

  const { currentUserId } = state;

  return { feedback, currentUserId, isNewFeedback };
}

const mapDispatchToProps = dispatch => ({
  dispatchSubmitFeedback: (feedback) => dispatch(actions.submitFeedback(feedback))
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackButton);