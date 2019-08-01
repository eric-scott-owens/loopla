import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import { batchFetchUsers } from '../../containers/users/actions';
import UserAvatar from '../UserAvatar';
import UserDisplayName from '../UserDisplayName';
import { fetchMembershipsForLoop } from '../../containers/loops/memberships/actions';
import './MemberList.scss';

function getUserIdsToDisplay(groupUsers, viewLimit) {
  let userIds;
  const isViewLimited = groupUsers.length > viewLimit;
  if(viewLimit && isViewLimited) {
    userIds = groupUsers.slice(0, viewLimit).map(ur => ur.id);
  }
  else {
    userIds = groupUsers.slice(0, groupUsers.length).map(ur => ur.id);
  }

  return userIds;
}

class MemberList extends React.Component {
  componentDidMount() {
    this.props.dispatchBatchFetchUsers(this.props.userIds);
    this.props.dispatchFetchMembershipsForGroup(this.props.groupId);
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.groupUsers !== nextProps.groupUsers || this.props.viewLimit !== nextProps.viewLimit) {
      this.props.dispatchBatchFetchUsers(nextProps.userIds);
    }

    return true;
  }

  render() {
    const { userIds, isViewLimited, showName, showFirstNameOnly, className, showOrganizers, organizers } = this.props;
    return (
      <span className={`o-member-list ${className}`}>
        {userIds.map((userId) => (
            <div 
              key={userId}
              className="o-member">
                <UserAvatar id={userId} /> 
                {showName && (<UserDisplayName id={userId} showFirstNameOnly={showFirstNameOnly} />)}
                {( showOrganizers && organizers.includes(userId) ) && <span className="o-organizer-label">Organizer</span>}
            </div>
          )
        )}
      </span>
    );

  }
}      

MemberList.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  showName: PropTypes.bool,
  showFirstNameOnly: PropTypes.bool,
  showOrganizers: PropTypes.bool,
  // eslint-disable-next-line
  viewLimit: PropTypes.number // If present, will limit the number of members shown
}

const emptyGroupUsersResultSet = [];

const mapStateToProps = (state, props) => {
  const { groupId } = props;
  const viewLimit = props.viewLimit ? parseInt(props.viewLimit, 10) : undefined;
  const groupUsers = state.groupUsers[groupId] || emptyGroupUsersResultSet;
  const organizers = [];
  forEach(state.memberships, membership => {
    if(membership.groupId === groupId && membership.isCoordinator) {
      organizers.push(membership.userId);
    }
  });
  const  userIds = getUserIdsToDisplay(groupUsers, viewLimit);
  const isViewLimited = groupUsers.length > userIds.length;
  
  return { groupUsers, userIds, isViewLimited, organizers };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchBatchFetchUsers: (ids) => dispatch(batchFetchUsers(ids)),
  dispatchFetchMembershipsForGroup: (groupId) => dispatch(fetchMembershipsForLoop(groupId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MemberList);