import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MoreHoriz from '@material-ui/icons/MoreHoriz';

import UserAvatar from '../UserAvatar';
import UserDisplayName from '../UserDisplayName';
import DateFormatter from '../DateFormatter';
import Kudos from '../Kudos';
import Loop from '../Loop';
import BasicButton from '../BasicButton';

import "./UserByLine.scss";

const DELETE_BUTTON_MESSAGES = {
  initial: 'Delete',
  deleting: 'Deleting',
  error: 'Error deleting, try again?'
};

class UserByLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      isModalVisible: false,
      deleteButtonText: DELETE_BUTTON_MESSAGES.initial
    };
  }

  onSuccess = () => {
    this.toggleDeleteConfirmModal();
  }

  onError = () => {
    this.setState({ deleteButtonText: DELETE_BUTTON_MESSAGES.initial.error });
  }

  toggleEditOrDeleteDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  
  handleDelete = () => {
    this.setState({ deleteButtonText: DELETE_BUTTON_MESSAGES.deleting });     
    this.props.onDelete(this.onSuccess, this.onError);
  }

  toggleDeleteConfirmModal = () => {
    this.setState(prevState => ({
      isModalVisible: !prevState.isModalVisible,
      deleteButtonText: DELETE_BUTTON_MESSAGES.initial
    }));
  }

  render() {
    const { showUserAvatar, showKudos, disableKudos, dontLinkToProfile, dontShowLoop, showMoreButton, onEdit, handleDelete } = this.props;
    const thing = this.props.for;
    const { ownerId, dateAdded } = thing;
    const modelType = thing ? thing.model : '';
    
    return (
      <div className="o-user-byline">
        
        {showUserAvatar && (<UserAvatar id={ownerId} dontLinkToProfile={dontLinkToProfile} />)}

        <div className="o-user-byline-center">
          <span className="o-user-byline-center-A"><UserDisplayName id={ownerId} dontLinkToProfile={dontLinkToProfile} /></span>
          {showKudos && (<Kudos for={thing} disabled={disableKudos} />)}
            <span className="o-user-byline-center-B">{thing.groupId && !dontShowLoop && (<span><Loop id={thing.groupId} /></span>)}
          </span>
        </div>
        
        <div className="o-user-byline-right">
          {dateAdded ? (<DateFormatter date={dateAdded} isTimeElapsed/>) : null}
          {showMoreButton && (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleEditOrDeleteDropdown}>
              <DropdownToggle className="o-icon-button">
                {(onEdit !== undefined || handleDelete !== undefined) &&
                  <MoreHoriz />
                }
              </DropdownToggle>
              <DropdownMenu right>
                {onEdit && 
                  (<DropdownItem onClick={onEdit}>Edit</DropdownItem>)
                }
                {handleDelete && 
                  (<DropdownItem onClick={this.toggleDeleteConfirmModal}>Delete</DropdownItem>)
                }
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        <Modal isOpen={this.state.isModalVisible} toggle={this.toggleDeleteConfirmModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleDeleteConfirmModal}>Delete {modelType}</ModalHeader>
          <ModalBody className="text-center">
            Are you sure you want to delete 
            this{modelType ? ` ${modelType.toLowerCase()}` : ''}? 
            <br />This action cannot be undone. 
          </ModalBody>
          <ModalFooter>
            <BasicButton color="secondary" onClick={this.toggleDeleteConfirmModal}>Cancel</BasicButton>
            <BasicButton onClick={this.props.handleDelete}>{this.state.deleteButtonText}</BasicButton> 
          </ModalFooter>
        </Modal>
        
      </div>)
    }
}
    
UserByLine.propTypes = {
  // eslint-disable-next-line
  for: PropTypes.shape({
    ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dateAdded: PropTypes.instanceOf(Date).isRequired,
    model: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  showUserAvatar: PropTypes.bool,
  showKudos: PropTypes.bool,
  disableKudos: PropTypes.bool,
  dontShowLoop: PropTypes.bool,
  dontLinkToProfile: PropTypes.bool,
  showMoreButton: PropTypes.bool,
  onEdit: PropTypes.func,
  handleDelete: PropTypes.func
}

export default UserByLine;