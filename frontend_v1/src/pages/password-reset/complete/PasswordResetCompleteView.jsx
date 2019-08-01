import React from 'react';
import configuration from '../../../configuration';
import Page from '../../Page';
import Toolbar from '../../../components/Toolbar';
import BasicButton from '../../../components/BasicButton';


// eslint-disable-next-line
class PasswordResetCompleteView extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
        <Page className="o-forgot-password text-center">
          <h1 className="o-m-top-xl">Success!</h1>
          <div className="o-section-spacing-normal o-section-width">Your password has been reset.</div> 
          <Toolbar>
            <BasicButton linkTo={`${configuration.APP_ROOT_URL}/login/`} className="o-button-center"> login </BasicButton>
          </Toolbar>
          
        </Page>
    );
  }

}

export default PasswordResetCompleteView;