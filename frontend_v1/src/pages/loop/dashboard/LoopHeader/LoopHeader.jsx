import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import Settings from '@material-ui/icons/Settings';
import { withRouter, Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';

import configuration from '../../../../configuration';
import * as postActions from '../../../../containers/posts/actions';
import { getGroupUsersReferencesFor } from '../../../../containers/users/actions';
import * as styleUtilities from '../../../../utilities/StyleUtilities';
import { getLoopSettingsUrl } from '../../../../utilities/UrlUtilities';

import DateFormatter from '../../../../components/DateFormatter';
import LoopDropdown from '../../../../components/LoopDropdown';
import MemberList from '../../../../components/MemberList';
import IconButton from '../../../../components/IconButton';
import Toolbar from '../../../../components/Toolbar';
import CategoriesScrollBar from '../../../../components/CategoriesScrollBar/CategoriesScrollBar';

import './LoopHeader.scss';

/**
 * Class names used to control loop header size
 */
const CLASS_NAMES = {
  loopHeader: {
    large: 'o-loop-header-large',
    small: 'o-loop-header-small'
  }
}

/**
 * Updates the loop header size when the user has scrolled
 * down the page
 */
const updateLoopHeaderSize = throttle(() => {
  if(window.pageYOffset > 100) {
    styleUtilities.addBodyClass(CLASS_NAMES.loopHeader.small);
    styleUtilities.removeBodyClass(CLASS_NAMES.loopHeader.large);
  }
  else {
    styleUtilities.addBodyClass(CLASS_NAMES.loopHeader.large);
    styleUtilities.removeBodyClass(CLASS_NAMES.loopHeader.small);
  }  
}, configuration.scrollThrottle.maxWait);

/**
 * Defines the LoopHeader component
 */
class LoopHeader extends React.PureComponent {

  componentDidMount() {
    window.addEventListener('scroll', updateLoopHeaderSize);
    styleUtilities.addBodyClass(CLASS_NAMES.loopHeader.large);
    this.props.dispatchGetPostCountForGroup(this.props.currentLoop.id);
    this.props.dispatchGetGroupUsersReferencesFor(this.props.currentLoop.id);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', updateLoopHeaderSize);
    styleUtilities.removeBodyClass(CLASS_NAMES.loopHeader.large);
    styleUtilities.removeBodyClass(CLASS_NAMES.loopHeader.small);
  }

  render() {

    const { 
      currentLoop,
      groupPostCount,
      groupMemberCount,
      canEditLoop,
      visibleMembersInLoopHeader
     } = this.props

    if (!currentLoop) return ("Loading...");

    return (
      <div className="o-loop-header">
        
        <div className={`o-responsive-page-container ${canEditLoop ? 'ensure-space-for-loop-button' : ''}`}>
          <LoopDropdown currentLoopId={currentLoop.id} />
        </div>

        { canEditLoop && (
          <Toolbar side="right" position="absolute" enableResponsivePageContainer>
            <IconButton 
              type="button" 
              className="o-edit-loop-settings" 
              linkTo={`${getLoopSettingsUrl(currentLoop.id)}/members`}
            >
              <Settings />
            </IconButton>
          </Toolbar>
        )}
        
        <div className="o-loop-collapse">

          <div className="o-responsive-page-container">
            
            <div className="o-loop-date-created">
              <span className="o-date">Founded </span><DateFormatter date={currentLoop.circle.dateCreated} />&nbsp;&#183;
              <span className="o-date"> { groupPostCount ? `${groupPostCount} posts` : null } </span>
            </div>

            <div className="o-loop-description">
              <TextTruncate
                line={1}
                truncateText="..."
                text={currentLoop.circle.description}
                textTruncateChild={<Link to={`${getLoopSettingsUrl(currentLoop.id)}/members`} className="o-truncate-text-helper">more</Link>}
              />
            </div>

            <div className="o-loop-members">
              <MemberList className="o-avatar-gallery" groupId={currentLoop.id} viewLimit={visibleMembersInLoopHeader} showName showFirstNameOnly />
              <IconButton 
                className="o-member-list-plus"
                linkTo={`${getLoopSettingsUrl(currentLoop.id)}/members`}
                >
                <React.Fragment>
                  {visibleMembersInLoopHeader < groupMemberCount && (
                    <span className="o-plus-number">+{groupMemberCount - visibleMembersInLoopHeader}</span>
                  )}
                  {visibleMembersInLoopHeader >= groupMemberCount && (
                    <span>All</span>
                  )}    
                </React.Fragment>
              </IconButton>
            </div>
            
            {/* <div className="o-loop-tags">
              <TopTagList groupId={currentLoop.id}/>
            </div> */}
            <div>
              <CategoriesScrollBar onSelectCategory={this.props.onSelectCategory} selectedCategoryId={this.props.selectedCategoryId} selectedLoopId={this.props.currentLoopId} />
            </div>
          </div>

        </div>

      </div>
    );
  }
}

LoopHeader.propTypes = {
  // eslint-disable-next-line
  currentLoopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectCategory: PropTypes.func,
  selectedCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const mapDispatchToProps = dispatch => ({
  dispatchGetPostCountForGroup: groupId => dispatch(postActions.fetchPostCountForGroup(groupId)),
  dispatchGetGroupUsersReferencesFor: groupId => dispatch(getGroupUsersReferencesFor(groupId)),
})

const mapStateToProps = (state, props) => {
  const currentLoop = state.groups[props.currentLoopId];
  const groupPostCount = state.postCountByGroup[props.currentLoopId];

  const groupMemberCount = get(state.groupUsers, `[${props.currentLoopId}].length`, 0);
  
  let canEditLoop = false;
  const { currentUserId, categories } = state;

  forEach(state.memberships, membership => {
    if(
      // membership.userId === currentUserId 
      // && membership.groupId === props.currentLoopId 
      membership.groupId === props.currentLoopId 
      && membership.isCoordinator
    ) {
      if(membership.userId === currentUserId){
        canEditLoop = true;
      }}
  });

  return { currentLoop,
    groupPostCount,
    groupMemberCount,
    canEditLoop,
    currentUserId,
    visibleMembersInLoopHeader: 6,
    categories
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoopHeader));