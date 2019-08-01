import React from 'react';
import { withRouter } from 'react-router-dom';
import LoginView from './LoginView'
import PageInitializer from '../PageInitializer';


const LoginPage = () => ( 
  <PageInitializer>
    <LoginView />    
  </PageInitializer>
);

export default withRouter(LoginPage);