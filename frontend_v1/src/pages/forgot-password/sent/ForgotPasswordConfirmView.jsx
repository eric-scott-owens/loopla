import React from 'react';
import configuration from '../../../configuration';
import Page from '../../Page';
import Toolbar from '../../../components/Toolbar';
import BasicButton from '../../../components/BasicButton';

import './ForgotPasswordConfirmView.scss';
// eslint-disable-next-line
class ForgotPasswordConfirmView extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
        <Page className="o-forgot-password-confirm text-center o-page-alt">
          <h1 className="o-m-top-xl">An email is on its way!</h1>
          <div className="o-section-spacing-normal o-section-width">
            If you don't receive an email shortly, make sure you've entered the correct address and check your spam folder.
          </div>
          <Toolbar>
            <BasicButton linkTo={`${configuration.APP_ROOT_URL}/login/`} className="o-button-center"> Back to login page </BasicButton>
            <BasicButton linkTo={`${configuration.APP_ROOT_URL}/forgot-password/`} color="secondary" className="o-button-center"> Resend Email </BasicButton>
          </Toolbar>
        </Page>
    );
  }
}

export default ForgotPasswordConfirmView;