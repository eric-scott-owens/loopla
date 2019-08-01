import React from 'react';
import { connect } from 'react-redux';
import { slide as SlideInMenu } from 'react-burger-menu';

import configuration from '../../../configuration';
import BasicButton from '../../../components/BasicButton';
import { logout } from '../../../containers/auth/actions';
import globalAppEventPublisher, { APP_EVENT_NAMES } from '../../../containers/appEvents/globalAppEventPublisher';

import FeedbackButton from '../../../components/FeedbackButton';

import './SideMenu.scss';

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  tryStartTour = () => {
    this.closeSideMenu();

    if(!this.props.isTourDisabled) { 
      globalAppEventPublisher.publishEvent(APP_EVENT_NAMES.startPageTour);
    }
  }

  closeSideMenu = () => {
    this.setState({ isOpen: false });
  }

  logout = () => {
    this.props.dispatchLogout();
  }

  render() {
    const { APP_ROOT_URL } = configuration;
    const { isTourDisabled } = this.props;
    return (
      <SlideInMenu isOpen={this.state.isOpen} right className="o-side-menu" customBurgerIcon={ <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/icons/baseline-help-24px-white.png`} alt="help" /> }>
        <BasicButton color="link" onClick={this.closeSideMenu} linkTo={`${APP_ROOT_URL}/how-it-works/`}>How It Works</BasicButton>
        <BasicButton 
          color="link" 
          disabled={isTourDisabled}
          onClick={this.tryStartTour}>Take the Tour</BasicButton>
        <div className="o-horizontal-line" />
        <FeedbackButton onClick={this.closeSideMenu} className="btn-link" />
        <div className="o-horizontal-line" />
        {/* <BasicButton className="o-menu-item-sm" color="link" linkTo={`${APP_ROOT_URL}/learn-more/`}>Learn More</BasicButton> */}
        <BasicButton className="o-menu-item-sm" color="link" onClick={this.closeSideMenu} linkTo={`${APP_ROOT_URL}/about/`}>About Loopla</BasicButton>
        <BasicButton className="o-menu-item-sm" color="link" onClick={this.closeSideMenu} linkTo={`${APP_ROOT_URL}/careers/`}>Careers</BasicButton>
        <BasicButton className="o-menu-item-sm" color="link" onClick={this.closeSideMenu} linkTo={`${APP_ROOT_URL}/privacy-policy/`}>Privacy Policy</BasicButton>
        <BasicButton className="o-menu-item-sm" color="link" onClick={this.closeSideMenu} linkTo={`${APP_ROOT_URL}/terms-of-service/`}>Terms of Service</BasicButton>
        {(configuration.CURRENT_DEPLOYMENT_ENVIRONMENT === configuration.DEPLOYMENT_ENVIRONMENTS.development) &&
          (
          <BasicButton className="o-menu-item-sm" color="link" onClick={this.closeSideMenu} linkTo={`${APP_ROOT_URL}/documentation/`}>Dev Docs</BasicButton>                      
          )
        }
        <div className="o-horizontal-line" />
        <BasicButton color="link" onClick={this.logout}>Log Out</BasicButton>
      </SlideInMenu>
    );
  }
}

const mapStateToProps = () => {
  const isTourDisabled = globalAppEventPublisher.getEventListenerCountFor(APP_EVENT_NAMES.startPageTour) === 0;
  return { isTourDisabled };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchLogout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);