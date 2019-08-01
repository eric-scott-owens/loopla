import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import configuration from '../../configuration';
import { navigateTo, navigateBack, navigateBackTo } from '../../containers/history/AppNavigationHistoryService';
import RibbonNav from '../RibbonNav';
import Loop from '../Loop';


function generateLocation(pathname, state) {
  if(state) {
    return { pathname, state };
  }

  return pathname;
}

class PageBackButton extends React.Component {

  onClick = () => {
    if(this.props.goBackToDashboard && this.props.lastVisitedGroupId) {
      if(this.props.categoryIdFilter){
        navigateTo(`${configuration.APP_ROOT_URL}/loop/${this.props.lastVisitedGroupId}/dashboard/?c=${this.props.categoryIdFilter}`);
      } else {
        navigateTo(`${configuration.APP_ROOT_URL}/loop/${this.props.lastVisitedGroupId}/dashboard/`);
      }
    }
    else if(this.props.backTo) {
      navigateBackTo(generateLocation(this.props.backTo, this.props.state));
    } else {
      navigateBack();
    }
  }

  getBodyContents = () => {
    const { children, goBackToDashboard, lastVisitedGroupId } = this.props;
    if(children) return children;
    if(goBackToDashboard && lastVisitedGroupId) return (<Loop id={lastVisitedGroupId} noLink/>);
    return ("Back");
  }

  render() {
    return (
      <RibbonNav color="primary" onClick={this.onClick}>
        {this.getBodyContents()}
      </RibbonNav>
    );
  }
}

PageBackButton.propTypes = {
  backTo: PropTypes.string, // URL to go back util we arrive at
  goBackToDashboard: PropTypes.bool, // If true, going back will return to the most recent dashboard (or the default)
  state: PropTypes.shape({}),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.bool])
}

const mapStateToProps = (state) => {
  const { lastVisitedGroupId } = state;
  const categoryIdFilter = state.lastVisitedCategoryId;
  
  return { lastVisitedGroupId, categoryIdFilter };
}

export default connect(mapStateToProps)(PageBackButton);