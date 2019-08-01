import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import configuration from '../../configuration';
import * as actions from '../../containers/tags/actions';
import TextFinder from '../TextFinder';

import './Tag.scss';


class Tag extends React.Component {
  componentDidMount() {
    if(this.props.id) {
      this.props.dispatchFetchTag(this.props.id);
    }
  }

  onDelete = (tag) => {
    if(this.props.onDelete) {
      this.props.onDelete(tag);
    }
  }

  render() {
    const { tag, count, noLink, onDelete, disabled, hidden } = this.props; 
    if(!tag) return null;

    const tagContents = (
      <React.Fragment>
        <span className={`tag ${tag.isUserGenerated ? 'tag-user-generated' : ''}`} >
          <span className="label o-tag-label"><TextFinder>{tag.name}</TextFinder></span>
        </span>

        {(count > 1) ? (<span className="o-tag-count">{count}</span>) : null}

        { onDelete && (
          <button 
            type="button" 
            className="o-delete-tag-button" 
            disabled={disabled}
            onClick={() => this.onDelete(tag)}>x</button> 
        )}
      </React.Fragment>
    );
    
    if(noLink && !hidden) return (
      <div className="o-tag-wrapper">
        {tagContents}
      </div>
    );

    if(!hidden) return (
      <Link 
        to={`${configuration.APP_SEARCH_URL}?t=${encodeURIComponent(tag.name)}`} 
        className="o-tag-wrapper"
        disabled={disabled}>
        {tagContents}
      </Link>
    );

    return (null);

  }
}

Tag.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  noLink: PropTypes.bool,
  onDelete: PropTypes.func,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool
}

const mapStateToProps = (state, props) => {
  // Fetch the tag from the store
  if(!props.tag) {
    const  tag = state.tags[props.id];
    return { tag };
  }

  return {};
}

const mapDispatchToProps = (dispatch) => ({
  dispatchFetchTag: (tagId) => dispatch(actions.fetchTag(tagId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tag);