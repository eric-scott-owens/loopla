import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import configuration from '../../configuration';
import * as postActions from '../../containers/posts/actions';
import * as userActions from '../../containers/users/actions';
import SearchContext from '../../containers/search/SearchContext';
import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import Loop from '../Loop';
import Tag from '../Tag';
import Place from '../Place';
import UserDisplayName from '../UserDisplayName';
import UserAvatar from '../UserAvatar';

class SearchResultsSummaryPostPreview extends React.Component {
  componentDidMount() {
    this.props.dispatchFetchPost(this.props.postId);
    this.props.dispatchFetchPostOwner(this.props.ownerId);
  }

  navigateToPost = () => {
    const { post, searchContext } = this.props;
    const pathname = `${configuration.APP_ROOT_URL}/posts/${post ? post.id : 'loading'}`;
    const to = { pathname, state: { searchContext }};
    navigateTo(to);
  }

  render() {
    const { post, owner, searchContext } = this.props;

    // Show post preview row
    return (
      <div className="o-search-results-attribution" onClick={this.navigateToPost} onKeyPress={this.navigateToPost} role="button" tabIndex="0" >
        {post && (
          <UserAvatar id={post.ownerId} dontLinkToProfile />
        )}
        <div className="o-avatar-text-right">
          {!post || !owner ? 
              'Loading...' 
            : (
              <React.Fragment>
                <div className="o-post-title">{post.summary || '[Untitled]'}</div>
                <UserDisplayName id={post.ownerId} dontLinkToProfile />
                &nbsp;&#183;&nbsp;
                <Loop id={post.groupId} noLink />
                
                {/* Mentioned thing */}
                { (searchContext.tagQuery || searchContext.placeIdQuery) && (
                  <React.Fragment>
                    &nbsp;&#183;&nbsp;
                    {searchContext.tagQuery && (<Tag tag={{ name: searchContext.tagQuery }} noLink />)}
                    {searchContext.placeIdQuery && (<Place id={searchContext.placeIdQuery} noLink noLinkHeader noMap noAddress noPhone noWebsite />)}
                    {' mentioned'}
                  </React.Fragment>
                )}

                {/* <DateFormatter date={post.dateAdded} isTimeElapsed/> */}
              </React.Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

SearchResultsSummaryPostPreview.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  searchContext: PropTypes.instanceOf(SearchContext).isRequired,
};

const mapStateToProps = (state, props) => {
  const post = state.posts[props.postId];
  const owner = state.users[props.ownerId];
  return { post, owner };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchPost: (postId) => dispatch(postActions.fetchPost(postId)),
  dispatchFetchPostOwner: (ownerId) => dispatch(userActions.fetchUser(ownerId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchResultsSummaryPostPreview));