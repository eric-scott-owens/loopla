import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';

import configuration from '../../../configuration';
import { navigateBackTo } from '../../../containers/history/AppNavigationHistoryService';
import { fetchGroups, setLastVisitedGroupId } from '../../../containers/loops/actions';
import * as invitationActions from '../../../containers/loops/invitations/actions';
import * as multiUseInvitationActions from '../../../containers/loops/multiUseInvitations/actions';
import { fetchMemberships } from '../../../containers/loops/memberships/actions';
import { getCurrentUser } from '../../../containers/users/actions';
import * as waitlistActions from '../../../containers/waitlist/actions';
import WaitlistValidator from '../../../containers/waitlist/validator';

import { onAcceptInvite } from '../../invitation/InvitationPage';
import { onAcceptMultiUseInvite } from '../../multiUseInvitation/MultiUseInvitationPage';

import PageInitializer from '../../PageInitializer';
import AutoForm from '../../../components/AutoForm';
import BasicButton from '../../../components/BasicButton';
import TextField from '../../../components/form-controls/TextField';
import TextArea from '../../../components/form-controls/TextArea';
import FullWidthSection from '../../../components/FullWidthSection';
import Toolbar from '../../../components/Toolbar';

import "./LandingPage.scss";

const validator = new WaitlistValidator();

const MODALS = [ 'waitlist', 'waitlistSuccess', 'invite', 'inviteSuccess' ];

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: null // The currently visible modal, one of MODALS.
    };
    
    // Create an object with a function for each modal to set it open.
    // e.g. setModalOpen[MODALS.invite] will set the invite modal open.
    this.setModalOpen = MODALS.reduce((obj, key) => ({
      ...obj,
      [key]: () => this.setState({ visibleModal: key })
    }), {});
  }

  onAcceptInvite = () => {
    const { invitation, dispatch, multiUseInvitation} = this.props;

    if(invitation.invitationId) {
      onAcceptInvite(invitation, dispatch);
    }

    if(multiUseInvitation.invitationId) {
      onAcceptMultiUseInvite(multiUseInvitation, dispatch);
    }
  }

  closeModal = () => {
    this.setState({ visibleModal: null });
  }

  addToWaitlist = () => {
    // this.setModalOpen.waitlistSuccess

    this.props.dispatchAddToWaitlist(this.props.userToSave);
  }

  backToInvitation = () => {
    const { invitation, multiUseInvitation } = this.props;

    if(invitation.invitationId) {
      navigateBackTo(`${configuration.APP_ROOT_URL}/invitation/${invitation.invitationKey}`);
    }
    else {
      navigateBackTo(`${configuration.APP_ROOT_URL}/join-loop/${multiUseInvitation.invitationKey}`);
    }
    
  }

  render() {
    const { userToSave, isUserLoggedIn, isUserEvaluatingInvitation } = this.props;

    return (
      <PageInitializer>
        <div className="o-public-page o-landing-page o-stacked-layout">

          <FullWidthSection className="o-section-inner-sm o-bg-1" id="landingOne">
            <h1 className="o-splash-h1">Solve Life Together</h1>
            <h3 className="o-text-color-f">Share useful information with people you know.</h3>
            {(!isUserLoggedIn && !isUserEvaluatingInvitation) && <BasicButton className="float-none o-bg-5 mt-3" onClick={this.setModalOpen.waitlist}>Join The Waitlist</BasicButton>}
            {(!isUserLoggedIn && isUserEvaluatingInvitation) && <BasicButton className="float-none o-bg-5 mt-3" onClick={this.onAcceptInvite}>Join Loop</BasicButton>}

          </FullWidthSection>

          { isUserEvaluatingInvitation ? 
          <FullWidthSection className="o-section-inner-sm o-bg-gradient-6" id="landingThree">
            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_lasso_mobile.png`} alt="monster" height="auto" width="245" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_lasso.png`} alt="monster" height="351" width="303" data-pin-nopin="true"/>
            <h2 className="o-splash-h2">Get in the loop.</h2>
            <p className="o-splash-p">You've been invited to be part of a loop. Loops are groups of people you trust, like co-workers, neighbors and workout buddies.</p>
          </FullWidthSection>
          :
          <FullWidthSection className="o-section-inner-sm o-bg-gradient-6" id="landingThree">
            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_lasso_mobile.png`} alt="monster" height="307" width="265" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_lasso.png`} alt="monster" height="351" width="303" data-pin-nopin="true"/>
            <h2 className="o-splash-h2">Form a loop.</h2>
            <p className="o-splash-p">Begin by forming a loop and inviting people who already know and trust each other. Neighbors, workout buddies, and classmates make great loops.</p>
          </FullWidthSection>
          }

          <FullWidthSection className="o-section-inner-sm o-bg-gradient-3" id="landingTwo">
            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_octomonster_mobile.png`} alt="monster" height="auto" width="300" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_octomonster.png`} alt="monster" height="auto" width="634" data-pin-nopin="true" />
            <h2 className="o-splash-h2">Share useful information.</h2>
            <p className="o-splash-p">Post questions, reviews, and recommendations to your loop. Find a reliable contractor or a fun community event. Borrow a tent. Get advice about your pet.</p>
          </FullWidthSection>
          
          <FullWidthSection className="o-section-inner-sm o-bg-gradient-5" id="landingFour">
            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_greenguy_new.png`} alt="monster" height="auto" width="200" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_greenguy_new.png`} alt="monster" height="auto" width="258" data-pin-nopin="true" />
            <h2 className="o-splash-h2 o-m-top-md">Relax. Speak freely.</h2>
            <p className="o-splash-p">All the content you share is kept 100% private to your loop so you can be open and honest.</p>
          </FullWidthSection>

          <FullWidthSection className="o-section-inner-sm o-bg-gradient-1" id="landingFive">
            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_confetti.png`} alt="monster" height="auto" width="240" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_confetti.png`} alt="monster" height="auto" width="272" data-pin-nopin="true" />
            <h2 className="o-splash-h2"><span className="o-break-text-xs">No ads. </span><span className="o-break-text-xs">No tracking. </span><span className="o-break-text-xs">Still free.</span></h2>
            <p className="o-splash-p">There are no ads to distract you from your loop's content. We don’t promote businesses or products. And we don’t track you.</p>
          </FullWidthSection>

          <FullWidthSection className="o-section-inner-sm o-bg-2" id="landingSix">
            {/* image visible on xs and sm devices */}
            <img className="d-md-none" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_furry_mobile.png`} alt="monster" height="auto" width="300" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_furry.png`} alt="monster" height="455" width="459" data-pin-nopin="true" />
            <h2 className="o-splash-h2">We won’t flood your inbox.</h2>
            <p className="o-splash-p">You control your notification preferences so you get updates when you want.</p>
          </FullWidthSection>

          <FullWidthSection className="o-bg-8" id="landingSeven">
            {/* visible on xs and sm devices */}
            <div className="d-md-none o-pre-footer-section">
              <div>Stay in the loop.</div>
              <BasicButton size="sm" className="o-bg-5" onClick={this.setModalOpen.waitlist}>Join the waitlist</BasicButton>
            </div>
            {/* visible on md, lg, and xl devices */}
            <div className="d-none d-md-block o-pre-footer-section"><span className="o-space-right-md">Stay in the loop.</span>
              {(!isUserLoggedIn && !isUserEvaluatingInvitation) && <BasicButton size="sm" className="o-bg-5" onClick={this.setModalOpen.waitlist}>Join the waitlist</BasicButton>}
              {(!isUserLoggedIn && isUserEvaluatingInvitation) && <BasicButton size="sm" className="o-bg-5" onClick={this.onAcceptInvite}>Join Loop</BasicButton>}
            </div>
          </FullWidthSection>

          <FullWidthSection className="o-footer-section">
            <div className="o-footer-menu">
              <Link style={{textDecoration: "none"}} to={`${configuration.APP_ROOT_URL}/careers/`} >Careers</Link>
              <Link style={{textDecoration: "none"}} to={`${configuration.APP_ROOT_URL}/privacy-policy/`} >Privacy Policy</Link>
              <Link style={{textDecoration: "none"}} to={`${configuration.APP_ROOT_URL}/terms-of-service/`} >Terms of Service</Link>
            </div>
          </FullWidthSection>

          <Modal isOpen={this.state.visibleModal === "waitlist"} toggle={this.closeModal} className={this.props.className}>
            <ModalHeader toggle={this.closeModal}>
              <div className="o-modal-img">
                <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_hug.png`} alt="monster" height="130" width="201" data-pin-nopin="true" />
              </div>
              Join the waitlist
            </ModalHeader>
            <ModalBody className="text-center">
              <div className="o-modal-subhead">Sign up today to get an invitation<br /> as soon as we launch.</div>
                <AutoForm
                data={userToSave}
                processingHandler={this.addToWaitlist}
                onProcessingComplete={this.setModalOpen.waitlistSuccess}
                onCancel={this.onCancel}
                validator={validator}
                processingButtonText={this.getProcessingButtonText}
                  >
                  <TextField
                    className="o-first-name"
                    placeholder="First Name"
                    valuePath="firstName" />
                  <TextField
                    className="o-last-name"
                    placeholder="Last Name"
                    valuePath="lastName" />
                  <TextField
                    className="o-email"
                    placeholder="Email"
                    valuePath="email" />
                  <TextArea
                    className="o-comment"
                    placeholder="Optional: If you're interested in starting a loop, describe the loop and how the members know each other. Or share comments or questions."
                    valuePath="comment" />
              </AutoForm>
            </ModalBody>
          </Modal>

          <Modal isOpen={this.state.visibleModal === "waitlistSuccess"} toggle={this.closeModal} className={this.props.className}>
            <ModalHeader toggle={this.closeModal}>
              <div className="o-modal-img">
                <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_hug.png`} alt="monster" height="130" width="201" data-pin-nopin="true" />
              </div>
              Success!
            </ModalHeader>
            <ModalBody className="text-center">
              <div className="o-modal-subhead">We will be in touch.</div>
            </ModalBody>
            <ModalFooter>
              <BasicButton color="link" onClick={this.closeModal}>OK</BasicButton>
            </ModalFooter>
          </Modal>

          { 
            isUserEvaluatingInvitation && 
            <Toolbar side='left' align='left' position='fixed'>
              <BasicButton className="o-landing-page-back-button" onClick={this.backToInvitation}>Back To Invitation</BasicButton>
            </Toolbar>
          }

        </div>
      </PageInitializer>
    );
  } 
}

LandingPage.propTypes = {
  isUserLoggedIn: PropTypes.bool
}

const mapStateToProps = (state) => {
  
  let userToSave = {
    id: "fakeID",
    model: "waitlistUser",
    firstName: "",
    lastName: "",
    email: "",
    comment: ""
  }

  if(state.editingObjects.fakeID) {
    userToSave = state.editingObjects.fakeID;
  }

  let isUserEvaluatingInvitation = false; 
  let invitation = {};
  let multiUseInvitation = {};

  if(state.invitationPage) {
    isUserEvaluatingInvitation = true;
    invitation = state.invitationPage;
  }

  if(state.multiUseInvitationPage) {
    isUserEvaluatingInvitation = true;
    multiUseInvitation = state.multiUseInvitationPage;
  }

  return { userToSave, isUserEvaluatingInvitation, invitation, multiUseInvitation };
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  dispatchAddToWaitlist: (waitlistUser) => dispatch(waitlistActions.addToWaitlist(waitlistUser)),
  dispatchAcceptInvitation: (invitationKey) => dispatch(invitationActions.acceptInvitation(invitationKey)),
  dispatchAcceptMultiUseInvitation: (invitationKey) => dispatch(multiUseInvitationActions.acceptMultiUseInvitation(invitationKey)),
  dispatchGetCurrentUser: () => dispatch(getCurrentUser()),
  dispatchFetchGroups: () => dispatch(fetchGroups()),
  dispatchFetchMemberships: () => dispatch(fetchMemberships()),
  dispatchSetLastVisitedGroupId: (groupId) => dispatch(setLastVisitedGroupId(groupId)),
  dispatchRemoveInvitation: (id) => dispatch(invitationActions.removeInvitationPage(id)),
  dispatchRemoveMultiUseInvitation: (id) => dispatch(multiUseInvitationActions.removeMultiUseInvitationPage(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);