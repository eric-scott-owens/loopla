import React from 'react';
import { withRouter } from 'react-router-dom';
import ForgotPasswordConfirmView from './ForgotPasswordConfirmView'
import PageInitializer from '../../PageInitializer';

const ForgotPasswordConfirmPage = () => ( 
  <PageInitializer>
    <ForgotPasswordConfirmView /> 
  </PageInitializer>
);

export default withRouter(ForgotPasswordConfirmPage);
