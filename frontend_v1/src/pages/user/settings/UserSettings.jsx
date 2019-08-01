import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';



class UserSettings extends React.Component {

  render() {
    const { id  } = this.props;
    if (!id) {
      return "Loading...";
    }

    return (
        <React.Fragment>

          <ProfileSettings id={id} />
          <AccountSettings id={id} />

        </React.Fragment>
    );
  }
}

UserSettings.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
export default (withRouter(UserSettings));