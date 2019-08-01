import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form } from 'reactstrap';
import configuration from '../../configuration';
import { login } from '../../containers/auth/actions';
import Page from '../Page';
import BasicButton from '../../components/BasicButton';
import TextField from '../../components/form-controls/TextField';
import PasswordField from '../../components/form-controls/PasswordField';
import Toolbar from '../../components/Toolbar'

import "./LoginView.scss";

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  onSignIn = () => {
    const { username, password } = this.state;
    if (username === "" || password=== "") {
      this.setState({error: 'Login failed'});
    }; // TODO show validation failure

    this.props.dispatchLogin({ username, password }).catch(() =>
      this.setState({ error: 'Login failed' }));
  };

  onProcessSubmit = (event) => {
    event.preventDefault();
    this.onSignIn();
  }

  setUsername = value => this.setState({ username: value });

  setPassword = value => this.setState({ password: value });
  
  render() {
    const { error, username, password } = this.state;
    return (
      <Page className="o-login text-center o-page-alt">
        <h1 className="o-m-top-xl">Sign in</h1>
        <Form onSubmit={this.onProcessSubmit} >

        <div className="o-section-spacing-normal o-section-width">
          <TextField
            placeholder="Username or Email*"
            value={username} 
            onChange={this.setUsername} />
        
          <PasswordField
            placeholder="Password*"
            value={password} 
            onChange={this.setPassword} />

          {error && <div>{error}</div>}
        </div>
        <Toolbar>
          <BasicButton
            autoFocus
            className="o-button-center"
            onClick={this.onSignIn}
            type="submit"
            >
            Sign In
          </BasicButton>

          <BasicButton
            className="o-button-center"
            color="secondary"
            linkTo={`${configuration.APP_ROOT_URL}/forgot-password/`} >
            Forgot Password?
          </BasicButton>
        </Toolbar>
        </Form>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchLogin: credentials => dispatch(login(credentials))
});

export default connect(
  null,
  mapDispatchToProps
)(withRouter(LoginView));
