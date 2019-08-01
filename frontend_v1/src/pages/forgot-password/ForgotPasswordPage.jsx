import React from 'react';
import { withRouter } from 'react-router-dom';
import ForgotPasswordView from './ForgotPasswordView'
import PageInitializer from '../PageInitializer';

const ForgotPasswordPage = () => ( 
  <PageInitializer>
    <ForgotPasswordView />
  </PageInitializer>
);

export default withRouter(ForgotPasswordPage);
