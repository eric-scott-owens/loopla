import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Delete from '@material-ui/icons/Delete';
import IconButton from '../IconButton';
import BasicButton from '../BasicButton';

import "./DeleteButton.scss";

const DELETE_BUTTON_MESSAGES = {
  initial: 'Delete',
  deleting: 'Deleting',
  error: 'Error deleting, try again?'
};

class DeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      deleteButtonText: DELETE_BUTTON_MESSAGES.initial
    };
  }

  onSuccess = () => {
    this.toggleModal();
  }

  onError = () => {
    this.setState({ deleteButtonText: DELETE_BUTTON_MESSAGES.initial.error });
  }
  
  handleDelete = () => {
    this.setState({ deleteButtonText: DELETE_BUTTON_MESSAGES.deleting });     
    this.props.onDelete(this.onSuccess, this.onError);
  }

  toggleModal = () => {
    this.setState(prevState => ({
      isModalVisible: !prevState.isModalVisible,
      deleteButtonText: DELETE_BUTTON_MESSAGES.initial
    }));
  }

  render() {

    const thing = this.props.for;
    const { disabled, children } = this.props;
    const modelType = thing ? thing.model : '';

    return ( 
      <span className="o-delete-button">
        <IconButton onClick={this.toggleModal} disabled={disabled}>
          {!children ? (<Delete />) : children}
        </IconButton>
        <Modal isOpen={this.state.isModalVisible} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Delete {modelType}</ModalHeader>
          <ModalBody className="text-center">
            Are you sure you want to delete 
            this{modelType ? ` ${modelType.toLowerCase()}` : ''}? 
            <br />This action cannot be undone. 
          </ModalBody>
          <ModalFooter>
            <BasicButton color="secondary" onClick={this.toggleModal}>Cancel</BasicButton>
            <BasicButton onClick={this.onDelete}>{this.state.deleteButtonText}</BasicButton> 
          </ModalFooter>
        </Modal>
      </span>         
    )
  } 
}

DeleteButton.propTypes = {
  disabled: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  for: PropTypes.shape({
    model: PropTypes.string
  })
}

export default DeleteButton;