import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { 
  Container,
  Form,
  Navbar,
  Nav,
  NavItem } from 'reactstrap';
import queryString from 'query-string';
import Notifications from '@material-ui/icons/Notifications';

import { isLoggedIn } from '../../containers/auth/reducers';
import * as userAuthActions from '../../containers/auth/actions';
import { navigateTo } from '../../containers/history/AppNavigationHistoryService';
import configuration from '../../configuration';
import { getLoopDashboardUrl, getUserProfileUrl } from '../../utilities/UrlUtilities';

import SearchBar from '../../components/SearchBar';
import SideMenu from './SideMenu';

import './TopNavBar.scss';

class TopNavBar extends React.Component {

  
  onSearch = (searchQuery) => {
    const searchRoot = configuration.APP_SEARCH_URL;
    navigateTo(`${searchRoot}?q=${searchQuery}`);
  }

  logout = () => {
    this.props.dispatchLogout();
  }

  render() {
    const { APP_ROOT_URL } = configuration;
    const { currentUser, isUserLoggedIn, lastVisitedGroupId } = this.props;
    const search = get(this.props, 'location.search');
    const queryValues = search ? queryString.parse(search) : '';
    const searchQuery = search ? get(queryValues, 'q') : '';


    return (
      <Navbar color="dark" dark fixed="top" className={`o-top-navbar ${isUserLoggedIn ? 'o-logged-in' : 'o-logged-out' }`}>
        {/* o-responsive-page-container-nav and o-responsive-page-container are defined within _responsive-page-container.scss
        Both classes are the same but can be targeted separately */}
        <Container fluid className="o-responsive-page-container-nav">
          

          <div className="o-top-navbar-side o-top-navbar-left-side">

            {/* Search Bar */}
            { isUserLoggedIn && (
              <div className="o-search-nav-item d-none d-md-block">
                <Form inline>
                  <SearchBar onSearch={this.onSearch} query={searchQuery} />
                </Form>
              </div>
            )}

          </div>

          {/* Logo */}
          <div className="o-top-navbar-logo">
            {
              (lastVisitedGroupId && isUserLoggedIn) ? 
                <Link to={getLoopDashboardUrl(lastVisitedGroupId)} className="o-logo-nav-item mx-auto text-center o-navbar-brand navbar-brand">
                  <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/logo/loopla_logo.png`} alt="Loopla" height="36" width="135" />
                </Link>   
                :
                <Link to={`${APP_ROOT_URL}/`} className="o-logo-nav-item mx-auto float-sm-left text-center order-0 order-md-1 o-navbar-brand navbar-brand">
                  <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/logo/loopla_logo.png`} alt="Loopla" height="36" width="135" />
                </Link>   
            }
          </div>

          <div className="o-top-navbar-side o-top-navbar-right-side">
            { isUserLoggedIn && (
              <React.Fragment>
                <Nav>
                  <NavItem className="d-none d-md-inline-block o-nav-item-spacing">
                    {
                    (lastVisitedGroupId) ?
                    <Link 
                      to={getLoopDashboardUrl(lastVisitedGroupId)} 
                      className="nav-link">
                      Home
                    </Link>
                    :
                    <Link 
                      to={`${APP_ROOT_URL}/`} 
                      className="nav-link">
                      Home
                    </Link>
                    }
                  </NavItem>

                  <NavItem className="d-none d-md-inline-block o-nav-item-spacing">
                    <Link 
                      to={getUserProfileUrl(currentUser.id)}
                      className="nav-link">
                        {currentUser.firstName}
                    </Link>
                  </NavItem>

                  <NavItem className="d-none d-md-inline-block">
                    <Link 
                      to={`${APP_ROOT_URL}/notifications`} 
                      className="nav-link o-top-nav-icon">
                        <Notifications />
                    </Link>
                  </NavItem>
                </Nav>

                <SideMenu />
              </React.Fragment>
            )}


            { !isUserLoggedIn && (
              <Nav>
                <NavItem>
                  <Link 
                    to={`${APP_ROOT_URL}/login/`} 
                    className="nav-link">
                    Login
                  </Link>
                </NavItem>
              </Nav>
            )}
          </div>

        </Container>
      </Navbar>
    );
  };
}

const mapStateToProps = (state) => {
  const isUserLoggedIn = isLoggedIn(state);
  const currentUser = state.users[state.currentUserId];
  const { lastVisitedGroupId } = state;
  return { isUserLoggedIn, currentUser, lastVisitedGroupId };
};


const mapDispatchToProps = dispatch => ({
  dispatchLogout: () => dispatch(userAuthActions.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopNavBar));