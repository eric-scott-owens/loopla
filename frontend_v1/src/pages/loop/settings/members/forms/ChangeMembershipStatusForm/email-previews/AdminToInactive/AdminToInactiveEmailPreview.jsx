import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EmailPreview from '../../../../../../../../components/EmailPreview';

const AdminToInactiveEmailPreview = ({children, loop, invitee}) => (
  <EmailPreview
    subject={`Your status in the ${loop.name} loop has changed`}
    className="o-admin-to-inactive-email-preview"
  >
    <React.Fragment>
      <p className="o-invitee-name">
        Hello {invitee.firstName},
      </p>
      <p>
        Your status has changed to inactive membership in the {loop.name} loop. 
        You will continue to be able to view existing posts but will not be 
        able to make new posts or view new posts. 
      </p>

      <div className="o-personal-message o-form-reverse">
        {children}
      </div>

    </React.Fragment>
  </EmailPreview>
)

AdminToInactiveEmailPreview.propTypes = {
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

export default connect(MapStateToProps)(AdminToInactiveEmailPreview);