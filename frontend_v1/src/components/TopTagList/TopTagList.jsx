import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../containers/tags/actions';
import TagList from '../TagList';

 class TopTagList extends React.Component {
    componentDidMount() {
      this.props.dispatchFetchTopTags(this.props.groupId);
    }

     render() {
        const { topTags } = this.props;

         if (!topTags) {
          return "Loading tags...";
        }

        return (
          <TagList tagIds={topTags} /> 
        );      
    } 
}

TopTagList.propTypes = {
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state) => {
  const { topTags } = state;
  return { topTags };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchTopTags: id => dispatch(actions.fetchTopTagsForGroup(id))
})
 
export default connect(mapStateToProps, mapDispatchToProps)(TopTagList); 