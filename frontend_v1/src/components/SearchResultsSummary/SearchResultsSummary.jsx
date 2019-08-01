import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import Waypoint from 'react-waypoint';
import get from 'lodash/get';

import configuration from '../../configuration';
import { batchFetchPosts } from '../../containers/posts/actions';
import { batchFetchUsers } from '../../containers/users/actions';
import SearchContext from '../../containers/search/SearchContext';

import SearchResultsSummaryPostPreview from '../SearchResultsSummaryPostPreview';
import LoadMoreButton from '../LoadMoreButton';

import './SearchResultsSummary.scss';

const postBatchLoadConfig = { comments: false, users: false, photos: false, tags: false, places: false };

function calculateNumberToDisplay(postReferences, selectedPage) {
  const max = selectedPage * configuration.PAGE_SIZES.searchPreviews;
  const actual = postReferences.length > max ? max : postReferences.length;
  return actual;
}

function getNextBatchToLoad(things, selectedPage) {
  const start = (selectedPage - 1) * configuration.PAGE_SIZES.searchPreviews;
  const end = calculateNumberToDisplay(things, selectedPage);
  const newThingsToLoad = things.slice(start, end);
  return newThingsToLoad;
}

class SearchResultsSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 1
    };
  }

  componentDidMount() {
    const { selectedPage } = this.state;
    const postIds = this.props.postReferences.map(pr => pr.id);
    const userIds = this.props.postReferences.map(pr => pr.ownerId);
    this.props.dispatchBatchFetchPosts(getNextBatchToLoad(postIds, selectedPage), postBatchLoadConfig);
    this.props.dispatchBatchFetchUsers(getNextBatchToLoad(userIds, selectedPage));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.postReferences !== nextProps.postReferences) {
      this.setState({selectedPage: 1});
    }
    
    if(
      this.state.selectedPage !== nextState.selectedPage
      || (
        this.props.postReferences !== nextProps.postReferences
        && nextProps.postReferences.length > 0
      )
    ) {
      const postIds = nextProps.postReferences.map(pr => pr.id);
      const userIds = nextProps.postReferences.map(pr => pr.ownerId);
      this.props.dispatchBatchFetchPosts(getNextBatchToLoad(postIds, nextState.selectedPage), postBatchLoadConfig);
      this.props.dispatchBatchFetchUsers(getNextBatchToLoad(userIds, nextState.searchIsLoading));
    }

    return true;
  }

  loadNextPage = () => {
    if (this.props.postReferences.length > (configuration.PAGE_SIZES.searchPreviews * this.state.selectedPage)) {
      // We have more posts to show... load another page
      this.setState(state => ({ selectedPage: state.selectedPage + 1 }));
    }
  }

  render() {
    const { postReferences, searchIsLoading, searchContext } = this.props;
    const numberToDisplay = calculateNumberToDisplay(postReferences, this.state.selectedPage);
    const visiblePostReferences = postReferences.slice(0, numberToDisplay);

    if(searchIsLoading) {
      return (<div className="o-search-results loading">Loading...</div>)
    }
    
    if(postReferences.length === 0) {
      return (<div className="o-search-results no-results">No search results</div>)
    }

    return (
      <div className="o-search-results-summary">
       
        {visiblePostReferences && visiblePostReferences.map((pr) =>
          <SearchResultsSummaryPostPreview 
            postId={pr.id} 
            ownerId={pr.ownerId} 
            key={pr.id} 
            searchContext={searchContext} />
        )}
        
        <Waypoint onEnter={this.loadNextPage} fireOnRapidScroll />
        {postReferences.length > visiblePostReferences.length && (
          <LoadMoreButton onClick={this.loadNextPage} />
        )}
      </div>
    );
}


}

SearchResultsSummary.propTypes = {
  searchContext: PropTypes.instanceOf(SearchContext).isRequired,
  // eslint-disable-next-line
  postReferences: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  })).isRequired,
}

const mapStateToProps = (state) => {
  const searchIsLoading = get(state, 'searchResult.isLoading', false);
  return { searchIsLoading };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchBatchFetchPosts: (postIds, config) => dispatch(batchFetchPosts(postIds, config)),
  dispatchBatchFetchUsers: (userIds) => dispatch(batchFetchUsers(userIds))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsSummary);