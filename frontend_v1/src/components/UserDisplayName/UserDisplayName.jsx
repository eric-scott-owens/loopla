import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import { getUserProfileUrl } from '../../utilities/UrlUtilities';
import * as actions from '../../containers/users/actions';
import PersonNameFormatter from '../PersonNameFormatter';

import './UserDisplayName.scss';

class UserDisplayName extends React.Component {
  componentDidMount() {
    if(
      !this.props.user &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.user)
    ) {
      this.props.dispatchFetchUser(this.props.id);
    }
  }

  render() {
    const { user, dontLinkToProfile } = this.props;

    const personName = 
      user ? 
        (<PersonNameFormatter firstName={user.firstName} middleName={user.middleName} lastName={user.lastName} showFirstNameOnly={this.props.showFirstNameOnly} />) :
        (<PersonNameFormatter firstName='' />);

    if(dontLinkToProfile) return (
      <span className="o-user-display-name">
        {personName}
      </span>
    );

    return (
      <Link 
        to={user ? getUserProfileUrl(user.id) : '#'} 
        className="o-user-display-name">
        {personName}
      </Link>
    );
  }
}

UserDisplayName.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dontLinkToProfile: PropTypes.bool,
  showFirstNameOnly: PropTypes.bool, 
};

const mapStateToProps = (state, props) => {
  let { user } = props;
  if(!user) {
    if(props.id) user = state.users[props.id];
    else throw new Error("CRITICAL: Cannot load user. An id must be provided");
  }

  return { user };
};

const mapDispatchToProps = dispatch => ({
  dispatchFetchUser: userId => dispatch(actions.fetchUser(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDisplayName);