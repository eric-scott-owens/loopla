import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import Edit from '@material-ui/icons/Edit';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import * as groupActions from '../../../../containers/loops/actions';
import * as userActions from '../../../../containers/users/actions';
import * as membershipActions from '../../../../containers/loops/memberships/actions';
import { sortUserArrayByFullName } from '../../../../utilities/SortUtilities';
import { getLoopMemberships } from '../../../../containers/loops/memberships/utilities';
import { getLoopUsers } from '../../../../containers/users/utilities';
import { getMembershipType } from '../../../../containers/loops/memberships/MembershipTypeEnum';
import { isCurrentUserCoordinatorOf } from '../../../../containers/loops/memberships/reducers';
import { navigateTo } from '../../../../containers/history/AppNavigationHistoryService'
import configuration from '../../../../configuration';

import PageInitializer from '../../../PageInitializer';
import UserDisplayName from '../../../../components/UserDisplayName';
import DateFormatter from '../../../../components/DateFormatter/DateFormatter';
import AddAdministratorForm from './forms/AddAdministratorForm';
import AddMemberForm from './forms/AddMemberForm';
import ChangeMembershipStatusForm from './forms/ChangeMembershipStatusForm';
import Toolbar from '../../../../components/Toolbar';
import BasicButton from '../../../../components/BasicButton';
import IconButton from '../../../../components/IconButton';
import UserAvatar from '../../../../components/UserAvatar';

import './Members.scss';


class Members extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      stature: 1,
      addUserContext: {
        isModalOpen: false,
        isSuccessMessageVisible: false
      },

      addAdministratorContext: {
        isModalOpen: false,
        isSuccessMessageVisible: false
      },

      changeMembershipStatusContext: {
        isModalOpen: false,
        isSuccessMessageVisible: false,
        userId: '',
        membershipId: ''
      }
    };
    this.dismissMessage = this.dismissMessage.bind(this)
  }

  componentDidMount() {
    this.props.dispatchGetSelectedLoop(this.props.id);
    this.props.dispatchGetLoopUsers(this.props.id);
    this.props.dispatchGetLoopMemberships(this.props.id);
  }

  onAdministratorAdded = () => {
    this.setState((state) => ({
      addAdministratorContext: {
        ...state.addAdministratorContext,
        isSuccessMessageVisible: true
      }
    }));
  }

  onUserAdded = () => {
    this.setState((state) => ({
      addUserContext: {
        ...state.addUserContext,
        isSuccessMessageVisible: true
      }
    }));
  }

  onChangeMembershipStatusComplete = () => {
    this.setState((state) => ({
      changeMembershipStatusContext: {
        ...state.changeMembershipStatusContext,
        isSuccessMessageVisible: true
      }
    }));
  }

  editMembership = (userId, membershipId) => {
    const { loop } = this.props;
    this.setState({
      changeMembershipStatusContext: {
        isModalOpen: true,
        loopId: loop.id,
        userId,
        membershipId
      }
    });
  }

  toggleChangeMembershipStatusModal = () => {
    this.setState((state) => ({ 
      changeMembershipStatusContext: { 
        ...state.changeMembershipStatusContext,
        isSuccessMessageVisible: false,
        isModalOpen: !state.changeMembershipStatusContext.isModalOpen 
      } 
    }));
  }

  toggleAddAdministratorModal = () => {
    this.setState((state) => ({ 
      addAdministratorContext: {
        ...state.addAdministratorContext,
        isSuccessMessageVisible: false,
        isModalOpen: !state.addAdministratorContext.isModalOpen
      }
    }));
  }

  toggleAddUserModal = () => {
    this.setState((state) => ({ 
      addUserContext: {
        ...state.addUserContext,
        isSuccessMessageVisible: false,
        isModalOpen: !state.addUserContext.isModalOpen
      }
    }));
  }

  dismissMessage = () => {
    this.toggleChangeMembershipStatusModal();
    navigateTo(`${configuration.APP_ROOT_URL}/loop/${this.props.id}`);
  }
  
  render() {
    const { loop, loopUsers, loopMemberships, isCoordinator } = this.props;
    const { changeMembershipStatusContext, addAdministratorContext, addUserContext } = this.state;

    if(!loop) return null;

    const loopUserMembershipHash = {};
    forEach(loopMemberships, membership => {
      // index memberships by userId
      loopUserMembershipHash[membership.userId] = membership;
    });

    const membershipData = [];
    forEach(loopUsers, user => {
      const userMembership = loopUserMembershipHash[user.id];
      if(userMembership) {
        membershipData.push({
          userId: user.id,
          membershipId: userMembership.id,
          dateJoined: userMembership.dateJoined,
          role: getMembershipType(userMembership)
        })
      }  
    });

    return (
      <PageInitializer noScrollToTop >
        <div className="o-loop-settings-members">

          {isCoordinator && (
            <Toolbar side="top" textAlign="left" className="o-membership-buttons">
              <BasicButton onClick={this.toggleAddUserModal} size="sm">Add Member</BasicButton>
              <BasicButton onClick={this.toggleAddAdministratorModal} size="sm" className="o-m-left-sm">Add Organizer</BasicButton>
            </Toolbar>
          )}

          {
            membershipData.map((member) => (
              <div className="o-member-info" key={member.membershipId}>
                <UserAvatar id={member.userId} /> 
                <div className="o-avatar-text-right">
                  <div className="o-member-name"><UserDisplayName id={member.userId} /><span className="o-organizer-label">{member.role === "Admin" && 'Organizer'}</span></div>
                  Member since <DateFormatter date={member.dateJoined} />
                  
                  {isCoordinator && (
                    <IconButton onClick={ () => this.editMembership(member.userId, member.membershipId) }><Edit /></IconButton>
                  )}
                </div>
              </div>
            )) 
          }

          {isCoordinator && (
            <React.Fragment>
              <Modal 
                isOpen={addAdministratorContext.isModalOpen}
                toggle={this.toggleAddAdministratorModal}
                className="o-add-administrator-modal o-responsive-modal"
              >
                { !addAdministratorContext.isSuccessMessageVisible && (
                  <ModalHeader toggle={this.toggleAddAdministratorModal}>
                    Invite a Loop Admin
                  </ModalHeader>
                )}
                <ModalBody>
                  <AddAdministratorForm 
                    loopId={loop.id} 
                    onCancel={this.toggleAddAdministratorModal} 
                    onProcessingComplete={this.onAdministratorAdded}
                    onDismissSuccessMessage={this.toggleAddAdministratorModal} />
                </ModalBody>
              </Modal>

              <Modal 
                isOpen={addUserContext.isModalOpen}
                toggle={this.toggleAddUserModal}
                className="o-add-member-modal o-responsive-modal"
              >
                {!addUserContext.isSuccessMessageVisible && (
                  <ModalHeader toggle={this.toggleAddUserModal}>
                    Invite New Members
                  </ModalHeader>
                )}
                <ModalBody>
                  <AddMemberForm 
                    loopId={loop.id} 
                    onCancel={this.toggleAddUserModal}
                    onProcessingComplete={this.onUserAdded}
                    onDismissSuccessMessage={this.toggleAddUserModal} />
                </ModalBody>
              </Modal>

              <Modal 
                isOpen={changeMembershipStatusContext.isModalOpen}
                toggle={this.toggleChangeMembershipStatusModal}
                className="o-change-membership-status-modal o-responsive-modal"
              >
                {!changeMembershipStatusContext.isSuccessMessageVisible && (
                  <ModalHeader toggle={this.toggleChangeMembershipStatusModal}>
                    Change the status of { ' ' }
                    <UserDisplayName 
                      id={changeMembershipStatusContext.userId}
                      dontLinkToProfile />
                  </ModalHeader>
                )}
                <ModalBody>
                  <ChangeMembershipStatusForm 
                    loopId={loop.id} 
                    userId={changeMembershipStatusContext.userId}
                    membershipId={changeMembershipStatusContext.membershipId}
                    onCancel={this.toggleChangeMembershipStatusModal}
                    onProcessingComplete={this.onChangeMembershipStatusComplete}
                    onDismissSuccessMessage={this.dismissMessage} />
                </ModalBody>
              </Modal>
            </React.Fragment>
          )}
        </div>
      </PageInitializer>
    );
  }


};

Members.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

const mapStateToProps = (state, props) => {
  const { id } = props;
  const loop = state.groups[id];
  
  const loopUsers = getLoopUsers(state, id);
  sortUserArrayByFullName(loopUsers);

  const loopMemberships = getLoopMemberships(state, id);
  const isCoordinator = isCurrentUserCoordinatorOf(state, id);
  
  return { loop, loopUsers, loopMemberships, isCoordinator };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchGetSelectedLoop: (selectedLoopId) => dispatch(groupActions.fetchGroup(selectedLoopId)),
  dispatchGetLoopUsers: (loopId) => dispatch(userActions.getAllUsersInGroup(loopId)),
  dispatchGetLoopMemberships: (loopId) => dispatch(membershipActions.fetchMembershipsForLoop(loopId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
