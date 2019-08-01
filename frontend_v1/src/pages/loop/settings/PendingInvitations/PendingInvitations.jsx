import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';

import * as invitationActions from '../../../../containers/loops/invitations/actions';
import { getLoopInvitations } from '../../../../containers/loops/invitations/utilities';

import PersonNameFormatter from '../../../../components/PersonNameFormatter';
import DateFormatter from '../../../../components/DateFormatter/DateFormatter';
import PageInitializer from '../../../PageInitializer';

import './PendingInvitations.scss';

class PendingInvitations extends React.Component {
  componentDidMount() {
    this.props.dispatchFetchInvitationsForLoop(this.props.id);
  }

  render() {
    const { invitations } = this.props;
    // Remove any invitations that aren't pending
    const data = [];
    forEach(invitations, invitation => {
      if(!invitation.isAccepted && !invitation.isDeclined) data.push(invitation);
    })

    return (
      <PageInitializer noScrollToTop >
        <div className="o-loop-settings-pending-invitations">
        {
          data.map((invitation) => (
            <div className="o-member-info" key={invitation.id}>
              <div className="o-member-name"><PersonNameFormatter firstName={invitation.invitee ? invitation.invitee.firstName : null} lastName={invitation.invitee ? invitation.invitee.lastName : null} /></div>
              Invited on <DateFormatter date={invitation.sentTimestamp} />
            </div>
          )) 
        }
        </div>
      </PageInitializer>
    );
  }
}

PendingInvitations.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

const mapStateToProps = (state, props) => {
  const invitations = getLoopInvitations(state, props.id);
  return { invitations }
};

const mapDispatchToProps = (dispatch) => ({
  dispatchFetchInvitationsForLoop: (loopId) => dispatch(invitationActions.fetchInvitationsForLoop(loopId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PendingInvitations);
