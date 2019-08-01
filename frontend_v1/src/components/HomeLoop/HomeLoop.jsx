import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../containers/loops/actions';


class HomeLoopView extends React.Component {

  componentDidMount() {
    this.props.dispatchFetchGroup(this.props.groupID);
  }

  render() {
    const { group } = this.props;

    if (!group) {
      return ("Loading...");
    }
    
    return ( 
      <div>
        {group.name}
      </div>
    )
  } 
}

HomeLoopView.propTypes = {
  groupID: PropTypes.number.isRequired
};

const mapStateToProps = (state, props) => {
  const group = state.groups[props.groupId];
  return { group };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchGroup: (id) => dispatch(actions.fetchGroup(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeLoopView);