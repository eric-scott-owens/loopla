import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import configuration from '../../configuration';
import PageInitializer from '../PageInitializer';
import UserDisplayName from '../../components/UserDisplayName';
import LoopList from '../../components/LoopList';
import BasicButton from '../../components/BasicButton';

import "./HomePage.scss";

const HomePage = ({ currentUser }) =>  (!currentUser) ? null : (
  <PageInitializer>
    <div className="o-home-page">
      <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_confetti.png`}
        alt="monster" height="314" width="266" data-pin-nopin="true" />
      <Row>
        <Col xs="12" sm="12" md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
          <h1>Hi <UserDisplayName id={currentUser.id} dontLinkToProfile showFirstNameOnly /></h1>
          <LoopList groupIDs={currentUser.groups}/>
          <BasicButton block linkTo={`${configuration.APP_ROOT_URL}/loop/new`}>
            Create New Loop
          </BasicButton>
        </Col>
      </Row>
    </div>
  </PageInitializer>
);

HomePage.propTypes = {
    currentUser: PropTypes.shape({
        firstName: PropTypes.string, 
        lastName: PropTypes.string,
        groups: PropTypes.arrayOf(PropTypes.string),
        username: PropTypes.string
    })
}

const mapStateToProps = state => {
    const { currentUserId, users } = state;
    const currentUser = users[currentUserId];
    return { currentUser };
}

export default connect(mapStateToProps)(HomePage);
