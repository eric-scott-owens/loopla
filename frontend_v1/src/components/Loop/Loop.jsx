import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import forEach from 'lodash/forEach';
import Edit from '@material-ui/icons/Edit';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import { getLoopDashboardUrl, getLoopSettingsUrl } from '../../utilities/UrlUtilities';
import * as groupActions from '../../containers/loops/actions';
import IconButton from '../IconButton'

import "./Loop.scss";

class Loop extends React.Component {

  componentDidMount() {
    if(
      !this.props.comment &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.Loop)
    ){
      this.props.dispatchFetchGroup(this.props.id);
    }
  }

  render() {
    const { group, noLink, showEdit, canEdit } = this.props;
    
    if (!group) {
      return ("Loading...");
    }

    return (
      <span className="o-loop">
        { noLink ? 
          (
            <span className="o-loop-name">
              {group.name}
            </span>
          ) : 
          (
            <span className="o-loop-name">
              <Link to={getLoopDashboardUrl(group.id)}>
                {group.name}
              </Link>
            </span>
          )
        }

        { showEdit && canEdit &&
          (
            <IconButton 
              className="o-edit-loop-details-btn"
              linkTo={`${getLoopSettingsUrl(group.id)}/details`}>
              <Edit />
            </IconButton>
          )
        }
      </span>
    );
  } 
}


Loop.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  noLink: PropTypes.bool,
  showEdit: PropTypes.bool
};

const mapStateToProps = (state, props) => {
  let { group } = props;
  if(!group) {
    if(props.id) group = state.groups[props.id];
    else throw new Error("CRITICAL: Cannot load loop. An id must be provided");
  }

  const { currentUserId } = state;
  let canEdit = false;

  forEach(state.memberships, membership => {
    if(
      membership.userId === currentUserId 
      && membership.groupId === props.id 
      && membership.isCoordinator
    ) {
      canEdit = true;
    }
  });

  return { group, currentUserId, canEdit };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchGroup: (id) => dispatch(groupActions.fetchGroup(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Loop);
