import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import get from 'lodash/get';
import { connect } from 'react-redux';

import configuration from '../../configuration';
import * as multiUseInvitationActions from '../../containers/loops/multiUseInvitations/actions';
import { getCurrentUser } from '../../containers/users/actions';
import { fetchGroups, setLastVisitedGroupId } from '../../containers/loops/actions';
import { fetchMemberships } from '../../containers/loops/memberships/actions';
import globalPostLoginTaskRunner from '../../containers/auth/globalPostLoginTaskRunner';
import { logout } from '../../containers/auth/actions';
import { isLoggedIn } from '../../containers/auth/reducers';
import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import FullWidthSection from '../../components/FullWidthSection';
import BasicButton from '../../components/BasicButton';
import PageInitializer from '../PageInitializer';
import Page from '../Page';
import DateFormatter from '../../components/DateFormatter';

import "./MultiUseInvitationPage.scss";

export function onAcceptMultiUseInvite(invitation, dispatch) {
  globalPostLoginTaskRunner.addTaskBatch([
    { 
      func: () => dispatch(multiUseInvitationActions.acceptMultiUseInvitation(invitation.invitationKey)), 
      isOneTimeTask: true,
      isBlocking: true
    },
    { 
      func: () => dispatch(multiUseInvitationActions.removeMultiUseInvitationPage(invitation.invitationId)), 
      isOneTimeTask: true,
      isBlocking: true
    },
    {
      func: () => dispatch(getCurrentUser()),
      isOneTimeTask: true,
      isBlocking: true
    },
    {
      func: () => dispatch(fetchGroups()),
      isOneTimeTask: true
    },
    {
      func: () => dispatch(fetchMemberships()),
      isOneTimeTask: true
    }
  ]);
  dispatch(setLastVisitedGroupId(invitation.group.id))
  navigateTo(`${configuration.APP_ROOT_URL}/register`);
}

class MultiUseInvitationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isLoadingInvitation: true
    };
  }

  componentDidMount() {
    this.props.dispatchLogout();
    const invitationPromise = this.props.dispatchGetMultiUseInvitation(this.props.match.params.key);
    invitationPromise.finally(() => {
      this.setState({ isLoadingInvitation: false});
    });
  }

  onAcceptMultiUseInviteClicked = () => {
    onAcceptMultiUseInvite(this.props.invitation, this.props.dispatch);
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen
    }));
  }

  render() {
    const { invitation } = this.props;

    // If we don't have the invitation yet... don't show anything
    if(this.state.isLoadingInvitation) return null;

    // If we didn't get an invitation, prompt the user to log in
    if(!invitation){
      return (
        <PageInitializer>
          <Page className="o-invitation-page text-center o-page-alt">
            <h1 className="o-m-top-xl">This invitation has already been accepted.</h1>
            <div className="o-section-spacing-normal o-section-width">
              Already a member?&nbsp;
              <Link 
                style={{textDecoration: "none"}}
                to={`${configuration.APP_ROOT_URL}/login`}
                >
                Sign in.
              </Link>
            </div>
          </Page>
        </PageInitializer>
      );
    }
    if(!invitation.invitationIsVisible){
      return(
        <div className="o-link-disabled-text">
          This link has been disabled.
        </div>
      )
    }
    // Show the invitation
    return (
      <PageInitializer>
        <div className="o-invitation-page o-stacked-layout">
          <FullWidthSection className="o-section-inner-sm o-bg-f" id="landingOne">
            <h1 className="o-invitation-header">Please join the discussion in the {invitation.group.name} Loop</h1>
            
            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_group_mobile.png`} alt="monster" height="auto" width="310" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_group.png`} alt="monster" height="auto" width="637" data-pin-nopin="true" />
            
            <h2 className="o-invitation-subhead">Get in the loop. Private group Q & A on the topics that matter to you.</h2>

            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/QA_categories_invitation.png`} alt="categories" height="auto" width="100%" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/QA_categories_invitation.png`} alt="categories" height="auto" width="680" data-pin-nopin="true" />

            <div className="o-invitation-loop-details">
              Organizers: {invitation.group.organizers.map((organizer) => 
                  <span key={organizer}>{organizer}&nbsp;&#183;&nbsp;</span> 
                )} 
            </div>
            <div className="">
              {invitation.group.members.length} 
              {invitation.group.members.length === 1 ? ' member has ' : ' members have '} 
              already joined
            </div>
            <BasicButton color="link" className="o-invitation-list-button" onClick={this.toggleModal}>See details</BasicButton>
            <BasicButton className="float-none o-bg-5 mt-3" onClick={this.onAcceptMultiUseInviteClicked}>Join the Loop</BasicButton>
          </FullWidthSection>

          <FullWidthSection className="o-footer-section">
            <div className="o-footer-menu">
              <Link style={{textDecoration: "none"}} to={`${configuration.APP_ROOT_URL}/careers/`} >Careers</Link>
              <Link style={{textDecoration: "none"}} to={`${configuration.APP_ROOT_URL}/privacy-policy/`} >Privacy Policy</Link>
              <Link style={{textDecoration: "none"}} to={`${configuration.APP_ROOT_URL}/terms-of-service/`} >Terms of Service</Link>
            </div>
          </FullWidthSection>

          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} className={`o-invitation-list-modal ${this.props.className}`}>
            <ModalHeader toggle={this.toggleModal}>{invitation.group.name}</ModalHeader>
            <ModalBody className="">
              <div className="o-invitation-loop-details">Founded <DateFormatter date={invitation.group.created} /></div>
              <div className="o-loop-description">{invitation.group.description}</div>
              <Row className="o-invitation-list">
              <Col sm="6" md={{ size: 6 }}>
                  <div className="o-invitation-list-title">
                    {invitation.group.members.length} 
                    {invitation.group.members.length === 1 ? ' Member' : ' Members'}
                  </div>
                  {invitation.group.members.map((member) => 
                    <span key={member}>{member}<br /></span>
                  )}
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <BasicButton onClick={this.toggleModal}>Close</BasicButton>
            </ModalFooter>
          </Modal>
        </div>
      </PageInitializer>
    )
  }

}

const mapStateToProps = (state, props) => {
  const isUserLoggedIn = isLoggedIn(state);
  const key = get(props, 'match.params.key');
  const invitation = state.multiUseInvitationPage;

  return { invitation, key, isUserLoggedIn };
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  dispatchLogout: () => dispatch(logout()),
  dispatchGetMultiUseInvitation: (key) => dispatch(multiUseInvitationActions.fetchMultiUseInvitationByKey(key)),
  dispatchAcceptMultiUseInvitation: (invitationKey) => dispatch(multiUseInvitationActions.acceptMultiUseInvitation(invitationKey)),
  dispatchGetCurrentUser: () => dispatch(getCurrentUser()),
  dispatchFetchGroups: () => dispatch(fetchGroups()),
  dispatchFetchMemberships: () => dispatch(fetchMemberships()),
  dispatchSetLastVisitedGroupId: (groupId) => dispatch(setLastVisitedGroupId(groupId)),
  dispatchRemoveMultiUseInvitation: (id) => dispatch(multiUseInvitationActions.removeMultiUseInvitationPage(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MultiUseInvitationPage));