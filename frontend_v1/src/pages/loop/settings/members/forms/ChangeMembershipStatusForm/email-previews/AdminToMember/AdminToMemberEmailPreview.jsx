import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EmailPreview from '../../../../../../../../components/EmailPreview';

const AdminToMemberEmailPreview = ({children, loop, invitee}) => (
  <EmailPreview
    subject={`Your status in the ${loop.name} loop has changed`}
    className="o-admin-to-member-email-preview"
  >
    <React.Fragment>
      <p className="o-invitee-name">
        Hello {invitee.firstName},
      </p>
      <p>
        Your role has changed from organizer to member for the {loop.name} loop. 
      </p>

      <div className="o-personal-message o-form-reverse">
        {children}
      </div>

    </React.Fragment>
  </EmailPreview>
)

AdminToMemberEmailPreview.propTypes = {
  // eslint-disable-next-line
  loopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  invitee: PropTypes.shape({
    firstName:  PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.element
}

const MapStateToProps = (state, props) => {
  const loop = state.groups[props.loopId];
  return { loop };
}

export default connect(MapStateToProps)(AdminToMemberEmailPreview);