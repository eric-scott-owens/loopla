import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody } from 'reactstrap';
import classnames from 'classnames';
import Edit from '@material-ui/icons/Edit';
import Replay from '@material-ui/icons/Replay';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import configuration from '../../../configuration';

// import configuration from '../../../../configuration';
import * as groupActions from '../../../containers/loops/actions';
import * as membershipActions from '../../../containers/loops/memberships/actions';
import * as multiUseInvitationActions from '../../../containers/loops/multiUseInvitations/actions';
import { replaceCurrentNavigation } from '../../../containers/history/AppNavigationHistoryService';

import PageInitializer from '../../PageInitializer';
import PageBackButton from '../../../components/PageBackButton';
import Toolbar from '../../../components/Toolbar';
import IconButton from '../../../components/IconButton';
import Page from '../../Page';
import PageFullWidthSection from '../../../components/PageFullWidthSection';
import Details from './details';
import Members from './members';
import PendingInvitations from './PendingInvitations';
import Toggle from '../../../components/form-controls/Toggle';
import BasicButton from '../../../components/BasicButton';

import './SettingsPage.scss';
import DateFormatter from '../../../components/DateFormatter/DateFormatter';

const LOOP_SETTINGS_TAB_NAMES = {
  members: '1',
  // We want the dash in the URL
  // eslint-disable-next-line
  ['pending-invitations']: '2'
};

// eslint-disable-next-line
(function(){
  const idMap = {};

  LOOP_SETTINGS_TAB_NAMES.getTabName = (tabId) => {
    if(!idMap[tabId]) {
      const keys = Object.keys(LOOP_SETTINGS_TAB_NAMES);
      forEach(keys, key => {
        idMap[LOOP_SETTINGS_TAB_NAMES[key]] = key;
      });
    }

    return idMap[tabId];
  }
}());


class LoopSettings extends React.Component {
  state = { showDetailsModal: false };

  componentDidMount() {
    this.props.dispatchGetSelectedLoop(this.props.selectedLoopId);
    this.props.dispatchFetchMembershipsForUser(this.props.currentUserId);
    this.props.dispatchGetInvitationByGroup(this.props.selectedLoopId);
  }

  setActiveTab(tabId) {
    const { params, path } = this.props.match;
    const parameterKeys = Object.keys(params);
    
    let url = path.toString();
    forEach(parameterKeys, parameterKey => {
      url = url.replace(
        `:${parameterKey}`, 
        (parameterKey === 'activeTab') ? 
          LOOP_SETTINGS_TAB_NAMES.getTabName(tabId) : 
          params[parameterKey]
      );
    })

    replaceCurrentNavigation(url);
  }

  toggleDetailsModal = () => {
    this.setState((state) => ({ showDetailsModal: !state.showDetailsModal }));
  }

  toggleInviteLinkModal = () => {
    this.setState((state) => ({ inviteLinkModal: !state.inviteLinkModal }));
  }

  deleteInvitationKey = () => {
    if (this.props.invitationKey)
    {
      this.props.dispatchDisableInvitationKey(this.props.invitationKey)
    }
  }

  updateInvitationKey = () => {
    this.props.dispatchCreateNewKey(this.props.invitationKey)
  }

  render() {
    const { selectedLoop, activeTab, canEdit, invitation } = this.props;
    const { showDetailsModal } = this.state;
    const { inviteLinkModal } = this.state;

    if(!selectedLoop) return null;
    if(!invitation) return null;

    return (
      <PageInitializer>
        <Page className="o-loop-settings">

          <PageBackButton goBackToDashboard />

          { canEdit && (
            <Toolbar side="top" textAlign="right" position="absolute" className="o-loop-details-edit">
              <IconButton onClick={this.toggleDetailsModal}><Edit /></IconButton>
            </Toolbar>
          )}       

          {/* Loop Details */}
          <div className="o-loop-name-title">{selectedLoop.circle.name}</div>

          <div className="o-loop-info">
            Founded <DateFormatter date={selectedLoop.circle.dateCreated} />
            { (selectedLoop.circle.city || selectedLoop.circle.state) && (<React.Fragment>&nbsp;&#183;&nbsp;</React.Fragment>) }
            <span>
              {selectedLoop.circle.city}
              {selectedLoop.circle.city && selectedLoop.circle.state && ' '}
              {selectedLoop.circle.state}
            </span>
          </div>
          <div className="o-loop-description">{selectedLoop.circle.description}</div>

          <BasicButton className="o-invitation-modal-button" onClick={this.toggleInviteLinkModal} size="sm">Get Invitation Link</BasicButton>

          {/* Admin View   */}
          { canEdit && (
            <React.Fragment>
              <PageFullWidthSection>
                <Nav tabs>
                  <NavItem className="o-loop-settings-nav-tab">
                    <NavLink
                      id="loop-members"
                      className={classnames({ active: LOOP_SETTINGS_TAB_NAMES[activeTab] === LOOP_SETTINGS_TAB_NAMES.members })}
                      onClick={ () => this.setActiveTab(LOOP_SETTINGS_TAB_NAMES.members)}
                      >
                      Members
                    </NavLink>
                  </NavItem>
    
                  {/* Only show pending invitations to organizers */}
                  {canEdit && (
                    <NavItem className="o-loop-settings-nav-tab">
                      <NavLink
                        id="loop-pending-invitations"
                        className={classnames({ active: LOOP_SETTINGS_TAB_NAMES[activeTab] === LOOP_SETTINGS_TAB_NAMES['pending-invitations'] })}
                        onClick={ () => this.setActiveTab(LOOP_SETTINGS_TAB_NAMES['pending-invitations'])}
                        >
                        Pending Invitations
                      </NavLink>
                    </NavItem>
                  )}
                </Nav>
              </PageFullWidthSection>
    
              <TabContent activeTab={LOOP_SETTINGS_TAB_NAMES[activeTab]} >
    
                <TabPane className="o-space-bottom-normal" tabId={LOOP_SETTINGS_TAB_NAMES.members}>
                  {activeTab === 'members' && (
                    <Members id={selectedLoop.id} />
                  )}
                </TabPane>
    
                {/* Only show pending invitations to organizers */}
                {canEdit && (
                  <TabPane className="o-space-bottom-normal" tabId={LOOP_SETTINGS_TAB_NAMES['pending-invitations']}>
                    {activeTab === 'pending-invitations' && (
                      <PendingInvitations id={selectedLoop.id} />
                    )}
                  </TabPane>
                )}
              </TabContent>
            
            </React.Fragment>
          )}

          {/* Member View */}
          { !canEdit && (
            <Members id={selectedLoop.id} />
          )}

          {/* Edit loop details modal */}
          <Modal
            isOpen={showDetailsModal}
            toggle={this.toggleDetailsModal}>
            <ModalHeader toggle={this.toggleDetailsModal}>Edit Loop Details</ModalHeader>
            <ModalBody>
              {showDetailsModal && (
                <Details 
                  id={selectedLoop.id}
                  onCancel={this.toggleDetailsModal}
                  onSaveComplete={this.toggleDetailsModal} />
              )}
            </ModalBody>
          </Modal>

          {/* Show invitation link modal */}
          <Modal
            isOpen={inviteLinkModal}
            toggle={this.toggleInviteLinkModal}>
            <ModalHeader toggle={this.toggleInviteLinkModal}>Invitation Link</ModalHeader>
            <ModalBody className="o-loop-invitation-link-body">
              Copy and send this invitation link:<br />
              <span className="o-loop-invitation-link">
                {invitation.invitationIsVisible ? 
                <Link to={`${configuration.APP_ROOT_URL}/join-loop/${invitation.invitationKey}`}>{`https://www.loopla.com/join-loop/${invitation.invitationKey}`}</Link>
                : "disabled"
                } 
                </span>

              <BasicButton className="o-loop-invitation-link-new" onClick={this.updateInvitationKey} size="sm">
                Change invitation link
              </BasicButton>

              <div className="o-loop-invitation-link-disable">
                <Toggle 
                value={invitation.invitationIsVisible} 
                onChange={this.deleteInvitationKey}
                label="Invitation link enabled"/>
              </div>
              
              
            </ModalBody>
          </Modal>

        </Page>
      </PageInitializer>
    );
  }
}

LoopSettings.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      loopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      activeTab: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

const mapStateToProps = (state, props) => {
  const activeTab = get(props, 'match.params.activeTab', LOOP_SETTINGS_TAB_NAMES.details);
  const idParam = get(props, 'match.params.loopId');
  const selectedLoopId = parseInt(idParam, 10);
  const selectedLoop = state.groups[selectedLoopId];
  const { currentUserId } = state;
  const invitation = state.multiUseInvitationPage;
  let invitationKey;
  if (invitation)
  {
    invitationKey = invitation.invitationKey
  }
  else
  {
    invitationKey = null
  }
  // TODO: Add permissions to edit page
  let canEdit = false;
  const canDelete = false;

  forEach(state.memberships, membership => {
    if(
      membership.userId === currentUserId 
      && membership.groupId === selectedLoopId 
      && membership.isCoordinator
    ) {
      canEdit = true;
    }
  });
  return { selectedLoop, selectedLoopId, activeTab, currentUserId, canEdit, canDelete, invitation, invitationKey };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchFetchMembershipsForUser: (userId) => dispatch(membershipActions.fetchMembershipsForUser(userId)),
  dispatchGetSelectedLoop: (selectedLoopId) => dispatch(groupActions.fetchGroup(selectedLoopId)),
  dispatchGetInvitationByGroup: (selectedLoopId) => dispatch(multiUseInvitationActions.fetchMultiUseInvitationByGroupId(selectedLoopId)),
  dispatchDisableInvitationKey: (invitationKey) => dispatch(multiUseInvitationActions.disableMultiUseInvitation(invitationKey)),
  dispatchCreateNewKey: (invitationKey) => dispatch(multiUseInvitationActions.editInvitationKey(invitationKey))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoopSettings));
