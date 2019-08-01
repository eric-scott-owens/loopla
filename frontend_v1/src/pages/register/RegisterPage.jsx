import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import forEach from 'lodash/forEach';
import PhoneNumberField from '../../components/form-controls/PhoneNumberField';

import configuration from '../../configuration';
import globalPostLoginTaskRunner from '../../containers/auth/globalPostLoginTaskRunner';
import { navigateTo } from '../../containers/history/AppNavigationHistoryService';
import { registerNewUser } from '../../containers/register/actions';
import { login } from '../../containers/auth/actions';

import PageInitializer from '../PageInitializer';
import Page from '../Page';
import PageFullWidthSection from '../../components/PageFullWidthSection';

import AutoForm, { getEditingObjectById } from '../../components/AutoForm';
import TextField from '../../components/form-controls/TextField';
import PasswordField from '../../components/form-controls/PasswordField';

import EmailFormValidator from '../../containers/register/validators/EmailFormValidator';
import UsernameFormValidator from '../../containers/register/validators/UsernameFormValidator';
import PasswordFormValidator from '../../containers/register/validators/PasswordFormValidator';
import UserGivenNameFormValidator from '../../containers/register/validators/UserGivenNameFormValidator';
import TelephoneFormValidator from '../../containers/register/validators/TelephoneFormValidator';
import Toggle from '../../components/form-controls/Toggle';

// AutoForm PrepareChildrenPlugins
import AutoTrimTextPlugin from '../../components/AutoForm/PrepareChildrenPlugins/AutoTrimTextPlugin';

import "./RegisterPage.scss";

const prepareChildrenPlugins = [ new AutoTrimTextPlugin() ];

const emailFormValidator = new EmailFormValidator();
const usernameFormValidator = new UsernameFormValidator();
const passwordFormValidator = new PasswordFormValidator();
const givenNameFormValidator = new UserGivenNameFormValidator();
const telephoneFormValidator = new TelephoneFormValidator();

const REGISTRATION_TAB_NAMES = {
  email: 'email',
  username: 'username',
  password: 'password',
  givenName: 'givenName',
  telephoneNumber: 'telephoneNumber'
}

const REGISTRATION_TAB_INDEXES = {
  [REGISTRATION_TAB_NAMES.email]: 0,
  [REGISTRATION_TAB_NAMES.username]: 1,
  [REGISTRATION_TAB_NAMES.password]: 2,
  [REGISTRATION_TAB_NAMES.givenName]: 3,
  [REGISTRATION_TAB_NAMES.telephoneNumber]: 4,
}

const emptyFormData = {
  id: 'REGISTRATION-DATA',
  model: 'NEW-USER-REGISTRATION',
  email: '',
  username: '',
  password: '',
  firstName: '',
  middleName: '',
  lastName: '',
  telephoneNumber: '',
  sendTextNotifications: true
};

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: REGISTRATION_TAB_NAMES.email,
      visitedTabs: {
        // Track the tabs that are enabled for user navigation
        [REGISTRATION_TAB_NAMES.email]: true
      }
    };

    // This is just used to pass data to AutoForm
    // No UI update will happen when changes happen
    // here. But we'll use it to pass data back to 
    // tabs we've already visited
    // this.formData = {...emptyFormData};
  }

  onFieldValueUpdateComplete = (fieldPath, fieldValue) => { 
    this.props.formData[fieldPath] = fieldValue;
  }

  onRegistrationCompleteHandler = async() => {
    const editingObject = getEditingObjectById(this.props.formData.id);
    this.props.dispatchLogin({ username: editingObject.username, password: editingObject.password });
    
    globalPostLoginTaskRunner.addTask({
      func: () => navigateTo(`${configuration.APP_ROOT_URL}/`),
      isOneTimeTask: true,
    });
  }

  setActiveTab = (tabName) => {
    if (this.state.activeTab !== tabName) {
      this.setState((state) => {   
        // Reset the visited tabs so that if we've gone backward
        // the tabs going forward are disabled again until validation
        // has a chance to run.
        const visitedTabs = {...state.visitedTabs};
        forEach(REGISTRATION_TAB_NAMES, option => {
          visitedTabs[option] = REGISTRATION_TAB_INDEXES[option] <= REGISTRATION_TAB_INDEXES[tabName];
        })

        // Return the updated state
        return {
          activeTab: tabName, 
          visitedTabs
        }
      });
    }
  }

  emailFormHandler = () => {
    this.setActiveTab(REGISTRATION_TAB_NAMES.username);
  }

  usernameFormHandler = () => {
    this.setActiveTab(REGISTRATION_TAB_NAMES.password);
  }

  passwordFormHandler = () => {
    this.setActiveTab(REGISTRATION_TAB_NAMES.givenName);
  }

  givenNameFormHandler = () => {
    this.setActiveTab(REGISTRATION_TAB_NAMES.telephoneNumber)
  }

  submitButtonTextProvider = (editingObject, props, isProcessing) => isProcessing ? 'submitting...' : 'submit';

  registerNewAccountHandler = async () => {
    const editingObject = getEditingObjectById(this.props.formData.id);
    return this.props.dispatchRegisterNewUser(editingObject);
  }

  render() {
    const { activeTab, visitedTabs } = this.state;
    const { formData } = this.props;

    return (
      <PageInitializer>
        <Page className="o-register-page text-center">
          <div className="o-section-spacing-normal o-section-width">

            <TabContent activeTab={activeTab}>
              <TabPane tabId={REGISTRATION_TAB_NAMES.email}>
                <div className="o-title-area">
                  <h1>Welcome to Loopla</h1>
                  Let&#039;s get you signed up.
                </div>
                
                <AutoForm
                  data={{...formData, id: formData.id}}
                  validator={emailFormValidator}
                  processingHandler={this.emailFormHandler}
                  processingButtonText="next"
                  dontRemoveEditingObjectAfterSave
                  processingButtonClassName="o-button-center"
                  onFieldValueUpdateComplete={this.onFieldValueUpdateComplete}
                  prepareChildrenPlugins={prepareChildrenPlugins}>
                  <div className="o-input-area o-m-top-xl o-m-bottom-xl">
                    <FormGroup>
                      <TextField 
                        type="email" 
                        valuePath="email"
                        placeholder="Email*"
                        autoTrimText />
                    </FormGroup>
                    Already a member?&nbsp;
                    <Link 
                      style={{textDecoration: "none"}}
                      to={`${configuration.APP_ROOT_URL}/login`}
                      >
                      Sign in.
                    </Link>
                  </div>
                </AutoForm>               
              </TabPane>

              <TabPane tabId={REGISTRATION_TAB_NAMES.username}>
                <div className="o-title-area">
                  <h1>Create a username</h1>
                  You will use your username to sign into Loopla.
                </div>

                <AutoForm
                  data={{...formData, id: formData.id}}
                  validator={usernameFormValidator}
                  processingHandler={this.usernameFormHandler}
                  processingButtonText="next"
                  dontRemoveEditingObjectAfterSave
                  processingButtonClassName="o-button-center"
                  onFieldValueUpdateComplete={this.onFieldValueUpdateComplete}>
                  <div className="o-input-area o-m-top-xl o-m-bottom-xl">
                    <FormGroup>
                      <TextField 
                        valuePath="username"
                        placeholder="Username*" />
                    </FormGroup>
                    No spaces allowed
                  </div>
                </AutoForm>
              </TabPane>

              <TabPane tabId={REGISTRATION_TAB_NAMES.password}>
                <div className="o-title-area">
                  <h1>Create a password</h1>
                </div>

                <AutoForm
                  data={{...formData, id: formData.id}}
                  validator={passwordFormValidator}
                  processingHandler={this.passwordFormHandler}
                  processingButtonText="next"
                  dontRemoveEditingObjectAfterSave
                  processingButtonClassName="o-button-center"
                  onFieldValueUpdateComplete={this.onFieldValueUpdateComplete}>
                  <div className="o-input-area o-m-top-xl o-m-bottom-xl">
                    <FormGroup>
                      <PasswordField 
                        valuePath="password"
                        placeholder="Password*" />
                    </FormGroup>
                    8 character minimum
                  </div>
                </AutoForm>
              </TabPane>

              <TabPane tabId={REGISTRATION_TAB_NAMES.givenName}>
                <div className="o-title-area">
                  <h1>Enter your full name</h1>
                  This is how your name will appear<br />to other members of your loop.
                </div>

                <AutoForm
                  data={{...formData, id: formData.id}}
                  validator={givenNameFormValidator}
                  processingHandler={this.givenNameFormHandler}
                  processingButtonText="next"
                  dontRemoveEditingObjectAfterSave
                  processingButtonClassName="o-button-center"
                  onFieldValueUpdateComplete={this.onFieldValueUpdateComplete}>  
                  <div className="o-input-area o-m-top-xl o-m-bottom-xl">
                    <FormGroup>
                      <TextField
                        valuePath="firstName"
                        placeholder="First Name*" />
                    </FormGroup>
                    <FormGroup>
                      <TextField 
                        valuePath="middleName"
                        placeholder="Middle Name (optional)" />
                    </FormGroup>
                    <FormGroup>
                      <TextField 
                        valuePath="lastName"
                        placeholder="Last Name*" />
                    </FormGroup>
                  </div>
                </AutoForm>
              </TabPane>

              <TabPane tabId={REGISTRATION_TAB_NAMES.telephoneNumber}>
                <div className="o-title-area">
                  <h1>Enter cell phone number</h1>
                  For optional text notifications.
                </div>

                <AutoForm
                  data={{...formData, id: formData.id}}
                  validator={telephoneFormValidator}
                  processingHandler={this.registerNewAccountHandler}
                  onProcessingComplete={this.onRegistrationCompleteHandler}
                  processingButtonText={this.submitButtonTextProvider}
                  processingButtonClassName="o-button-center"
                  onFieldValueUpdateComplete={this.onFieldValueUpdateComplete}>
                  <div className="o-input-area-sm o-m-top-xl o-m-bottom-xl">
                    <FormGroup>
                    <PhoneNumberField 
                      className="o-user-phone-number"
                      placeholder="Phone Number (Optional)"
                      valuePath="telephoneNumber" />
                    </FormGroup>
                    <div className="o-toggle-container">
                      <Toggle 
                        valuePath="sendTextNotifications" 
                        label="Send me text notifications" />
                    </div>
                  </div>
                  
                  <div className="o-submit-area">
                    By creating your account and using Loopla,<br />you are agreeing to our&nbsp;
                    <Link 
                      style={{textDecoration: "none"}}
                      target="_blank"
                      to={`${configuration.APP_ROOT_URL}/terms-of-service/`}
                      >
                      Terms of Service
                    </Link>.
                  </div>  
                </AutoForm>
              </TabPane>
            </TabContent>

          </div>

          <PageFullWidthSection>
            <Nav tabs>
              <NavItem>
                <NavLink
                  id="1"
                  className={`o-progress-tab o-progress-tab-1of5 ${visitedTabs[REGISTRATION_TAB_NAMES.email] ? 'visited' : ''} ${activeTab === REGISTRATION_TAB_NAMES.email ? 'active' : ''}`}
                  onClick={ () => this.setActiveTab(REGISTRATION_TAB_NAMES.email)}
                  disabled={!visitedTabs[REGISTRATION_TAB_NAMES.email]}
                  />
              </NavItem>
              <NavItem>
                <NavLink
                  id="2"
                  className={`o-progress-tab o-progress-tab-2of5 ${visitedTabs[REGISTRATION_TAB_NAMES.username] ? 'visited' : ''} ${activeTab === REGISTRATION_TAB_NAMES.username ? 'active' : ''}`}
                  onClick={ () => this.setActiveTab(REGISTRATION_TAB_NAMES.username)}
                  disabled={!visitedTabs[REGISTRATION_TAB_NAMES.username]}
                  />
              </NavItem>
              <NavItem>
                <NavLink
                  id="#"
                  className={`o-progress-tab o-progress-tab-3of5 ${visitedTabs[REGISTRATION_TAB_NAMES.password] ? 'visited' : ''} ${activeTab === REGISTRATION_TAB_NAMES.password ? 'active' : ''}`}
                  onClick={ () => this.setActiveTab(REGISTRATION_TAB_NAMES.password)}
                  disabled={!visitedTabs[REGISTRATION_TAB_NAMES.password]}
                  />
              </NavItem>
              <NavItem>
                <NavLink
                  id="#"
                  className={`o-progress-tab o-progress-tab-4of5 ${visitedTabs[REGISTRATION_TAB_NAMES.givenName] ? 'visited' : ''} ${activeTab === REGISTRATION_TAB_NAMES.givenName ? 'active' : ''}`}
                  onClick={ () => this.setActiveTab(REGISTRATION_TAB_NAMES.givenName)}
                  disabled={!visitedTabs[REGISTRATION_TAB_NAMES.givenName]}
                  />
              </NavItem>
              <NavItem>
                <NavLink
                  id="#"
                  className={`o-progress-tab o-progress-tab-5of5 ${visitedTabs[REGISTRATION_TAB_NAMES.telephoneNumber] ? 'visited' : ''} ${activeTab === REGISTRATION_TAB_NAMES.telephoneNumber ? 'active' : ''}`}
                  onClick={ () => this.setActiveTab(REGISTRATION_TAB_NAMES.telephoneNumber)}
                  disabled={!visitedTabs[REGISTRATION_TAB_NAMES.telephoneNumber]}
                  />
              </NavItem>
            </Nav>
          </PageFullWidthSection>
          
        </Page>
      </PageInitializer>
    )
  } 
}

const mapStateToProps = state => {
  const formData = {...emptyFormData};
  
  if (state.invitationPage) {
    const { invitee } = state.invitationPage;
    formData.firstName = invitee.firstName;
    formData.lastName = invitee.lastName;
    formData.email = invitee.email;
  }

  // eslint-disable-next-line consistent-return      this.onFieldValueUpdateComplete('lastName', invitee.lastName);

  return { formData };  
}

const mapDispatchToProps = (dispatch) => ({
  dispatchRegisterNewUser: (registrationRequest) => dispatch(registerNewUser(registrationRequest)),
  dispatchLogin: credentials => dispatch(login(credentials))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RegisterPage));