import React from 'react';
import { withRouter } from 'react-router-dom';
import PasswordResetCompleteView from './PasswordResetCompleteView'
import PageInitializer from '../../PageInitializer';

const PasswordResetCompletePage = () => ( 
  <PageInitializer>
    <PasswordResetCompleteView />
  </PageInitializer>
);

export default withRouter(PasswordResetCompletePage);
