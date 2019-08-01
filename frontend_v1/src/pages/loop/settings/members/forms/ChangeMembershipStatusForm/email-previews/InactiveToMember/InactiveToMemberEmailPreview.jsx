import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EmailPreview from '../../../../../../../../components/EmailPreview';

const InactiveToMemberEmailPreview = ({children, loop, invitee}) => (
  <EmailPreview
    subject={`Your status in the ${loop.name} loop has changed`}
    className="o-inactive-to-member-email-preview"
  >
    <React.Fragment>
      <p className="o-invitee-name">
        Hello {invitee.firstName},
      </p>
      <p>
        You are reinstated as an active member of the {loop.name} loop. 
        You may now make new posts and view new posts.
      </p>

      <div className="o-personal-message o-form-reverse">
        {children}
      </div>

    </React.Fragment>
  </EmailPreview>
)

InactiveToMemberEmailPreview.propTypes = {
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

export default connect(MapStateToProps)(InactiveToMemberEmailPreview);