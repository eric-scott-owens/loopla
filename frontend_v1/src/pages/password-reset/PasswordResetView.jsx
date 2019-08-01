import React from 'react';
import { connect } from 'react-redux';
import {  withRouter } from 'react-router-dom';

import configuration from '../../configuration';
import * as userAuthActions from '../../containers/auth/actions';
import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import PasswordField from '../../components/form-controls/PasswordField';
import Page from '../Page';
import Toolbar from '../../components/Toolbar';
import BasicButton from '../../components/BasicButton';

import './PasswordResetView.scss';

class ForgotPasswordResetView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null, 
      token: null,
      passwordOne: "",
      passwordTwo: ""
    };

  }

  componentDidMount() {
    const { uid, token } = this.props.match.params;

    this.setState({
      uid, 
      token
    });
  }
  
  setPasswordOne = value => this.setState({ passwordOne: value });

  setPasswordTwo = value => this.setState({ passwordTwo: value });

  passwordReset = async () => {
    const { uid, token, passwordOne, passwordTwo } = this.state;

    if (passwordOne !== passwordTwo) {
      this.setState({ error: 'Passwords do not match' });
    } else if (passwordOne === "" || passwordTwo === "") {
      this.setState({ error: 'Password field cannot be empty.'});
    }
    else {
      this.setState({ error: null });
      try {
        await this.props.dispatchSubmitPasswordReset(uid, token, passwordOne, passwordTwo);
        navigateTo(`${configuration.APP_ROOT_URL}/password-reset/complete/`)
      } catch(error) {
        this.setState({ error: 'Password reset failed' })
      }
  
    } 

    
  };
  
  render() {
    const { error, passwordOne, passwordTwo } = this.state;

    return (
      <Page className="o-password-reset text-center o-space-top-normal o-space-bottom-normal">
        <h1 className="o-m-top-xl">Create a New Password</h1>

        <div className="o-section-spacing-normal o-section-width">
          <PasswordField
            placeholder="New Password*"
            value={passwordOne} 
            onChange={this.setPasswordOne} />

          <PasswordField
            placeholder="Confirm Password*"
            value={passwordTwo} 
            onChange={this.setPasswordTwo} />
        </div>
      
        {error && <div>{error}</div>}
        
        <Toolbar>
          <BasicButton onClick={this.passwordReset} className="o-button-center"> Reset </BasicButton>
        </Toolbar>

      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchSubmitPasswordReset: (uid, token, passwordOne, passwordTwo) => dispatch(userAuthActions.submitPasswordReset(uid, token, passwordOne, passwordTwo))
});  

export default connect(
  null,
  mapDispatchToProps
)(withRouter(ForgotPasswordResetView));
