import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import orderBy from 'lodash/orderBy';

import Tag from '../Tag';
import { batchFetchTags } from '../../containers/tags/actions';

import "./TagList.scss";

class TagList extends React.Component {

  componentDidMount() {
    if(this.props.tagIds && this.props.tagIds.length > 0) {
      this.props.dispatchBatchFetchTags(this.props.tagIds);
    }
  }

  shouldComponentUpdate(nextProps) {
    if(
      this.props.tagIds !== nextProps.tagIds 
      && nextProps.tagIds
      && nextProps.tagIds.length > 0
    ) {
      this.props.dispatchBatchFetchTags(nextProps.tagIds);
    }

    return true;
  }

  render() {
    const {tagIds, tagUsage} = this.props;
    if(!tagIds) return null;
    
    return (
      <div className="o-tag-list">
        <React.Fragment>
          {tagUsage.map(t => (<Tag key={t.id} id={t.id} count={t.count} />))}
        </React.Fragment>
      </div>
    )
  }
} 

TagList.propTypes = {
  tagIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
}

const mapStateToProps = (state, props) => {
  const tagIds = (props.tagIds || []).slice(0);

  // Add counts
  const usageDictionary = {};
  forEach(tagIds, (id) => {
    const indexedUsage = usageDictionary[id] || { id, count: 0 };
    usageDictionary[id] = { ...indexedUsage, count: (indexedUsage.count + 1) };
  });

  // Sort by name
  let tags = [];
  forEach(keys(usageDictionary), tagId => { 
    if(state.tags[tagId]) {
      tags.push(state.tags[tagId]); 
    } 
  });
  
  tags = orderBy(tags, 'name');

  // Return the sorted usage
  const tagUsage = tags.map(t => usageDictionary[t.id]);

  return { tagUsage };
  
}

const mapDispatchToProps = (dispatch) => ({
  dispatchBatchFetchTags: (tagIds) => dispatch(batchFetchTags(tagIds))
});

export default connect(mapStateToProps, mapDispatchToProps)(TagList);