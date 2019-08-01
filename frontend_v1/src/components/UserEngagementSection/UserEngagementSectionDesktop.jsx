import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';
import './UserEngagementSection.scss';
import { updateUserEngagementSection } from '../../containers/loops/memberships/userEngagementSection/actions';
import configuration from '../../configuration';

class UserEngagementSectionDesktop extends Component{
  constructor(props){
    super(props);
    this.onUserEngagementDismiss = this.onUserEngagementDismiss.bind(this)
  }

  onUserEngagementDismiss = async () => {
    const updatedMembership = { ...this.props.membershipObject };
    updatedMembership['userEngagementSectionDismissed'] = true; 
    await this.props.dispatchUpdateUserEngagementSection(updatedMembership);
  }

  handleClick = (e) => {
    e.preventDefault()
    this.onUserEngagementDismiss();
  }

  render(){
    if (!this.props.membershipObject)
    {
      return(
        null
      )
    }
    if (this.props.membershipObject['userEngagementSectionDismissed'] === true)
    {
      return(
        <Link to={`${configuration.APP_ROOT_URL}/posts/new`}>
          <div className="o-user-engagement-section o-user-engagement-section-desktop">
            <p className="o-user-engagement-title">Ask a question about...</p>
            <div className="o-user-engagement-topics-group">
              <span className="o-user-engagement-topics">
              auto repair&nbsp;&#183;
              home contractors&nbsp;&#183;
              physical therapy&nbsp;&#183;
              schools&nbsp;&#183;
              hair stylists&nbsp;&#183;
              house cleaners&nbsp;&#183;
              pet sitters&nbsp;&#183;
              etc.
              </span>
              <div className="o-user-engagement-button">ASK QUESTION</div>
            </div>
          </div>
        </Link>
      )
    } 

    return(
      <Link to={`${configuration.APP_ROOT_URL}/posts/new`}>
        <div className="o-user-engagement-section o-user-engagement-section-desktop">
          <p className="o-user-engagement-title">Ask your first a question about...</p>
          <div className="o-user-engagement-topics-group">
            <span className="o-user-engagement-topics">
            auto repair&nbsp;&#183;
            home contractors&nbsp;&#183;
            physical therapy&nbsp;&#183;
            schools&nbsp;&#183;
            hair stylists&nbsp;&#183;
            house cleaners&nbsp;&#183;
            pet sitters&nbsp;&#183;
            etc.
            </span>

            <div className="o-user-engagement-button">ASK QUESTION</div>

          </div>
        </div>
      </Link>
    );
  }
}

UserEngagementSectionDesktop.propTypes = {
  currentLoopId: PropTypes.oneOfType([
                  PropTypes.string,
                  PropTypes.number
                ]),
}

const mapStateToProps = (state, props) => {
  const { currentLoopId } = props;
  const { currentUserId } = state;
  const loop = state.groups[currentLoopId];
  let membershipObject = null
  forEach(state.memberships, (membership) => {
    if (membership.groupId === currentLoopId && 
      membership.userId === currentUserId)
      {
        membershipObject = membership
      }
  });

  return { currentLoopId, currentUserId, loop, membershipObject };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateUserEngagementSection: (updatedMembership) => dispatch(updateUserEngagementSection(updatedMembership)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserEngagementSectionDesktop));