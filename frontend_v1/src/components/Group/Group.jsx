import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import * as groupActions from '../../containers/loops/actions';

class Group extends React.Component {
  onComponentDidMount() {
    if(
      !this.props.group &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.group)
    ) {
      this.props.dispatchFetchGroup(this.props.id);
    }
  }
  
  render() {
    const { group } = this.props;
    
    if(!group) return null;
    
    return (
        <div className="group">
          {group.name}
        </div> 
    );
  }
}

Group.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state, props) => {
  let { group } = props;
  if(!group) {
    if(props.id) group = state.groups[props.id];
    else throw new Error("CRITICAL: Cannot load post. An id must be provided");
  }
  
  return { group };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchGroup: (id) => dispatch(groupActions.fetchGroup(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);