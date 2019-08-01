import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logNavigationAction } from '../../containers/telemetry/actions';

class TelemetryLink extends React.Component {
  onClick = (event) => {

    if(this.props.to) {
      this.props.dispatchLogNavigationAction(this.props.to);
    }
    
    if(this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    const { to, onClick, children, dispatchLogNavigationAction, ...others } = this.props;
    return (
      <Link to={to} onClick={this.onClick} {...others}>{children}</Link>
    );
  }
}

TelemetryLink.propTypes = {
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
  dispatchLogNavigationAction: (url) => dispatch(logNavigationAction(url))
});

export default connect(null, mapDispatchToProps)(TelemetryLink);