import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import * as actions from '../../containers/users/actions';

class UserAddress extends React.Component {
  componentDidMount() {
    if(
      !this.props.user &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.user)
    ) {
      this.props.dispatchFetchUser(this.props.id);
    }
  }

  render() {
    const { user, showFullAddress } = this.props;
    if(!user) return null;

    if (showFullAddress) {
      return (
        <span>
          {user.addressLine1 && (<span className="o-address-line-1">{user.addressLine1}<br /></span>)}
          {user.addressLine2 && (<span className="o-address-line-2">{user.addressLine2}<br /></span>)}
          {user.addressLine3 && (<span className="o-address-line-3">{user.addressLine3}<br /></span>)}
          <br/>
          {user.city && `${user.city}, ${user.state}`} 
          {user.zipcode && `, ${user.zipcode}`}
        </span>
      );
    }

    return ( 
      <span>
          {user.city && `${user.city}, ${user.state}`} 
      </span>
    );
  }
}

UserAddress.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showFullAddress: PropTypes.bool
}

const mapStateToProps = (state, props) => {
  let { user } = props;
  if(!user) {
    if(props.id) user = state.users[props.id];
    else throw new Error("CRITICAL: Cannot load address. An id must be provided");
  }

  return { user };
};

const mapDispatchToProps = dispatch => ({
  dispatchFetchUser: userId => dispatch(actions.fetchUser(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAddress);