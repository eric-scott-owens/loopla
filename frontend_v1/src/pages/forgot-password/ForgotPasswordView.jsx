import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import configuration from '../../configuration';
import * as userAuthActions from '../../containers/auth/actions';
import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import Page from '../Page';
import Toolbar from '../../components/Toolbar';
import TextField from '../../components/form-controls/TextField';
import BasicButton from '../../components/BasicButton';


import './ForgotPasswordView.scss';

class ForgotPasswordView extends React.Component {
  state = {
    userEmail: ""
  };

  
  setEmail = value => this.setState({ userEmail: value});

  passwordReset = async () => {
    const { userEmail } = this.state;
    const { dispatchSendPasswordEmail } = this.props;
    if (!userEmail) return; // TODO show validation failure

    try {
      await dispatchSendPasswordEmail(userEmail);
      navigateTo(`${configuration.APP_ROOT_URL}/forgot-password/sent/`);
    } 
    catch(error) {
      this.setState({ error: 'Password reset failed' })
    }
  };

  render() {
    const { userEmail } = this.state;

    return (
      <Page className="o-forgot-password text-center o-page-alt">
        <h1 className="o-m-top-xl">Reset Your Password</h1>

        <div className="o-section-spacing-normal o-section-width">
          <TextField
            placeholder="Email*"
            value={userEmail} 
            onChange={this.setEmail} />
        </div>
      
        <Toolbar>
          <BasicButton
            onClick={this.passwordReset}
            className="o-button-center">Reset my password</BasicButton>
        </Toolbar>

      </Page>

    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchSendPasswordEmail: userEmail => dispatch(userAuthActions.sendPasswordEmail(userEmail))
});  

export default connect(
  null,
  mapDispatchToProps
)(withRouter(ForgotPasswordView));