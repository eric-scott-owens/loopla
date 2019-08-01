import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import PageInitializer from '../PageInitializer';
import Post from '../../components/Post';
import Page from '../Page';
import * as inPageSearchActions from '../../containers/search/inPageFinder/actions';

class PostPage extends React.Component {

  componentDidMount() {
    const searchContext = this.getSearchContext();
    if(searchContext) {
      this.props.dispatchSetInPageFinderContext(searchContext);
    }
  }

  componentWillUnmount() {
    const searchContext = this.getSearchContext();
    if(searchContext) {
      this.props.dispatchClearInPageFinderContext();
    }
  }

  getSearchContext = () => {
    const searchContext = get(this.props, 'location.state.searchContext', undefined);
    return searchContext;
  }

  render () {
    const { postId } = this.props;
    if(!postId) return null;
    
    return (
      <PageInitializer>
        <Page>
          <Post id={postId} searchContext={this.getSearchContext()}/>
        </Page>
      </PageInitializer>
    )  
  }
} 

PostPage.propTypes = {
  // eslint-disable-next-line
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
    }).isRequired
  }).isRequired,
  // eslint-disable-next-line
  location: PropTypes.shape({
    state: PropTypes.shape({
      searchContext: PropTypes.shape({
        textQuery: PropTypes.string,
        tagQuery: PropTypes.string,
        placeIdQuery: PropTypes.string
      })
    })
  })
};

const mapStateToProps = (state, props) => {
  const idParam = get(props, 'match.params.id');

  if(idParam === 'new') {
    return { postId: newKeyFor(configuration.MODEL_TYPES.post) };
  }
  
  const postId = parseInt(idParam, 10);
  return { postId };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchSetInPageFinderContext: (searchContext) => dispatch(inPageSearchActions.setContext(searchContext)),
  dispatchClearInPageFinderContext: () => dispatch(inPageSearchActions.clearContext())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PostPage));
