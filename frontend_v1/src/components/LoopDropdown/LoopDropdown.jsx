import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import configuration from '../../configuration';
import { getLoopDashboardUrl } from '../../utilities/UrlUtilities';
import { canCurrentUserCreateNewLoops } from '../../containers/users/reducers';

import './LoopDropdown.scss';


class LoopDropdown extends React.Component {
  constructor(props) {
    super(props);
  
    this.toggle = this.toggle.bind(this);
    this.state = {
    dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
    dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const { currentLoop, currentUser, otherLoops, blockNewLoopCreation } = this.props;

    /* 
      A bit of optimization "magic" here.
      We know that App.jsx loads up the current user and all of
      their groups, so we won't worry about loading it. Instead,
      We will only render this header when all of the above is
      available
    */
    if(
      !currentLoop ||
      !currentUser
    ) {
      return null;
    } 

    return (
      <div className="o-loop-dropdown">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
              {currentLoop.name}
          </DropdownToggle>
          <DropdownMenu>     
            {
              otherLoops.map(group => (
                    <Link 
                      to={getLoopDashboardUrl(group.id)} 
                      className="dropdown-item o-dropdown-item" 
                      key={group.id}>{
                        (group.name.length > 28) ?
                          `${group.name.substring(0, 25)}...`:
                          group.name
                      }</Link>
                ))

            }
              <Link 
                to={blockNewLoopCreation ? '/' : `${configuration.APP_ROOT_URL}/loop/new`}
                className="dropdown-item o-dropdown-item"
              >
                Create New Loop {blockNewLoopCreation && ' - Coming Soon'}
              </Link>
          </DropdownMenu>
        </Dropdown>
      </div>
      );
  }
}

LoopDropdown.propTypes = {
  // eslint-disable-next-line
  currentLoopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

const mapStateToProps = (state, props) => {
  const { groups, currentUserId, users } = state;
  const { currentLoopId } = props;
  const currentLoop = groups[currentLoopId];
  const currentUser = users[currentUserId];
  const otherLoops = [];
  const blockNewLoopCreation = !canCurrentUserCreateNewLoops(state);

  if(currentUser) {
    // Gather current user's loops
    currentUser.groups.forEach(groupId => {
      if(groupId !== currentLoopId) {
        const group = groups[groupId];
        if(group) {
          otherLoops.push(group);
        }
      }
    });
  }

  return { currentLoop, currentUser, otherLoops, blockNewLoopCreation };
}

export default connect(mapStateToProps)(LoopDropdown);
