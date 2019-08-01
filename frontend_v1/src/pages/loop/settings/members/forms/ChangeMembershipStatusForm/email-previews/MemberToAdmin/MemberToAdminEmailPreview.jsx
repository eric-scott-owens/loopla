import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EmailPreview from '../../../../../../../../components/EmailPreview';
import UserDisplayName from '../../../../../../../../components/UserDisplayName';
import BasicButton from '../../../../../../../../components/BasicButton';

const InviteAsAdminEmailPreview = ({children, loop, currentUser, invitee}) => (
  <EmailPreview
    subject={`${currentUser.firstName} ${currentUser.middleName} ${currentUser.lastName} has invited you to be an organizer of the ${loop.name} loop.`}
    className="o-member-to-admin-email-preview"
  >
    <React.Fragment>
      <p className="o-invitee-name">
        Hello {invitee.firstName},
      </p>

      <p>
        <UserDisplayName id={currentUser.id} dontLinkToProfile /> { ' ' }
        has invited you to be an organizer of the {loop.name} loop.
      </p>

      <div className="o-personal-message o-form-reverse">
        {children}
      </div>

      <BasicButton size="sm" className="float-none o-m-bottom-md">Learn More or Accept</BasicButton>

    </React.Fragment>
  </EmailPreview>
)

InviteAsAdminEmailPreview.propTypes = {
  // eslint-disable-next-line
  loopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  invitee: PropTypes.shape({
    firstName:  PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.element
}

const MapStateToProps = (state, props) => {
  const currentUser = state.users[state.currentUserId];
  const loop = state.groups[props.loopId];
  return { currentUser, loop };
}

export default connect(MapStateToProps)(InviteAsAdminEmailPreview);