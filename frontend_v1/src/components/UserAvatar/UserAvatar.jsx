import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import { getUserProfileUrl } from '../../utilities/UrlUtilities';
import * as actions from '../../containers/users/actions';

import "./UserAvatar.scss";

class UserAvatar extends React.Component {

  componentDidMount() {
    if(
      !this.props.user &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.user)
    ) {
      this.props.dispatchFetchUser(this.props.id);
    }
  }

  render() {
    const { user, dontLinkToProfile, className } = this.props;
    const serverUserId = user ? user.id : '#';
    const userIdAttributeValue = `avatar-user-id-${serverUserId}`;  
    
    const userPhoto = (
      <div 
        className="o-user-avatar-img" 
        style={user ? { backgroundImage: `url(${user.photo})` } : {}}
        id={userIdAttributeValue} />
    );

    if(dontLinkToProfile) return (
      <span className={`o-user-avatar${className ? ` ${className}` : '' }`}>
        {userPhoto}
      </span>
    );

    return (
      <Link 
        to={user ? getUserProfileUrl(user.id) : 'pending'}
        className={`o-user-avatar${className ? ` ${className}` : '' }`}>
        {userPhoto}
      </Link>
    );
  }
}

UserAvatar.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dontLinkToProfile: PropTypes.bool,
  className: PropTypes.string
};

const mapStateToProps = (state, props) => {
  let { user } = props;
  if(!user) {
    if(props.id) {
      user = state.users[props.id];
    }
    else {
      throw new Error("CRITICAL: Cannot load user. An id must be provided");
    } 
  }

  return { user };
};

const mapDispatchToProps = dispatch => ({
  dispatchFetchUser: userId => dispatch(actions.fetchUser(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatar);