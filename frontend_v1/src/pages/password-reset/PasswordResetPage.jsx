import React from 'react';
import { withRouter } from 'react-router-dom';
import ForgotPasswordResetView from './PasswordResetView'
import PageInitializer from '../PageInitializer';

const ForgotPasswordResetPage = () => ( 
<PageInitializer>
  <ForgotPasswordResetView />
</PageInitializer>
);

export default withRouter(ForgotPasswordResetPage);