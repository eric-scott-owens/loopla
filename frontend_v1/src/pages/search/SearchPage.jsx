import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import PageInitializer from '../PageInitializer';
import SearchResultsSummary from '../../components/SearchResultsSummary';
import MentionedPlaces from '../../components/MentionedPlaces';
import TagList from '../../components/TagList';
import Page from '../Page';
import PageBackButton from '../../components/PageBackButton';
import PageFullWidthSection from '../../components/PageFullWidthSection'
import Place from '../../components/Place';

import SearchContext from '../../containers/search/SearchContext';
import { querySearch, clearSearchResults, queryRelatedPlaces } from '../../containers/search/actions';
import * as placesActions from '../../containers/places/actions';

import './SearchPage.scss';

const SEARCH_TAB_NAMES = {
  posts: '1',
  mentionedPlaces: '2',
  relatedTags: '3'
};

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: SEARCH_TAB_NAMES.posts
    };
  }

  componentDidMount() {
    const search = get(this.props, 'location.search');
    if(search) {
      const queryValues = queryString.parse(search);
      const query = get(queryValues, 'q');
      const tag = get(queryValues, 't');
      const place = get(queryValues, 'p',);
      this.props.dispatchQuerySearch({ query, tag, place });
    }
  }

  shouldComponentUpdate(nextProps) {
    const nextSearch = get(nextProps, 'location.search');
    const currentSearch = get(this.props, 'location.search');
    const nextQueryValues = queryString.parse(nextSearch);
    const currentQueryValues = queryString.parse(currentSearch);
    
    const nextQuery = get(nextQueryValues, 'q');
    const currentQuery = get(currentQueryValues, 'q');
    const nextTag = get(nextQueryValues, 't');
    const currentTag = get(currentQueryValues, 't');
    const nextPlace = get(nextQueryValues, 'p');
    const currentPlace = get(currentQueryValues, 'p');

    if(nextQuery !== currentQuery || nextTag !== currentTag || nextPlace !== currentPlace) {

      this.props.dispatchClearSearchResults();

      if(nextQuery || nextTag || nextPlace) {
        this.props.dispatchQuerySearch({ query: nextQuery, tag: nextTag, place: nextPlace });
      }

      this.setActiveTab(SEARCH_TAB_NAMES.posts);

      return false;
    }

    return true;
  }

  componentWillUnmount() {
    this.props.dispatchClearSearchResults();
  }

  // needed for tabs
  setActiveTab = (tabName) => {
    if (this.state.activeTab !== tabName) {
      this.setState({
        activeTab: tabName
      });
    }
  }
  // end needed for tabs

  render() {
    const { searchResultError, searchResultPosts, searchResultRelatedPlaces, searchResultRelatedTags } = this.props;
    const search = get(this.props, 'location.search');
    const queryValues = search ? queryString.parse(search) : '';
    const textQuery = search ? get(queryValues, 'q') : null;
    const tagQuery = search ? get(queryValues, 't') : null;
    const placeQuery = search ? get(queryValues, 'p') : null;
    const placeId = placeQuery ? parseInt(placeQuery, 10) : null;
    const searchContext = new SearchContext({textQuery, tagQuery, placeIdQuery: placeId });
    
    if (searchResultError) { return (<div className="o-search-page">{searchResultError}</div>) }
    
    return (
      <PageInitializer>
        <Page className="o-search-page">

          <PageBackButton />

          {textQuery && <div><h1>{textQuery}</h1></div>}
          {tagQuery && <div><h1 className="o-tag-large">{tagQuery}</h1></div>}
          {placeId && 
            <div className="o-place-expanded">
              <Place id={placeId} noLinkHeader />
            </div>
          }

          {!textQuery && !tagQuery && !placeId ? (
            <h2 className="o-helpful-text">Search content<br />from all your loops.</h2>
          ) : (
            <React.Fragment>

              <PageFullWidthSection>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      id="searchSummary"
                      className={classnames({ active: this.state.activeTab === SEARCH_TAB_NAMES.posts })}
                      onClick={() => { this.setActiveTab(SEARCH_TAB_NAMES.posts); }}>
                      Posts<span className="o-search-results-count">&nbsp;{searchResultPosts ? searchResultPosts.length : '...'}</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="searchPlaces"
                      className={classnames({ active: this.state.activeTab === SEARCH_TAB_NAMES.mentionedPlaces })}
                      onClick={() => { this.setActiveTab(SEARCH_TAB_NAMES.mentionedPlaces); }}>
                      Mentioned Places<span className="o-search-results-count">&nbsp;{searchResultRelatedPlaces ? searchResultRelatedPlaces.length : '...'}</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="searchRelated"
                      className={classnames({ active: this.state.activeTab === SEARCH_TAB_NAMES.relatedTags })}
                      onClick={() => { this.setActiveTab(SEARCH_TAB_NAMES.relatedTags); }}>
                      <span className="o-search-results-type">Mentioned Tags</span>
                      <span className="o-search-results-count">&nbsp;{searchResultRelatedTags ? searchResultRelatedTags.length : '...'}</span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </PageFullWidthSection>

              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1" className="o-search-page-tab-1">
                  <SearchResultsSummary postReferences={searchResultPosts} searchContext={searchContext} />
                </TabPane>
                <TabPane tabId="2" className="o-search-page-tab-2">
                  <MentionedPlaces mentionedPlaces={searchResultRelatedPlaces} />
                </TabPane>
                <TabPane tabId="3" className="o-search-page-tab-3">
                  <TagList tagIds={searchResultRelatedTags} />
                </TabPane>
              </TabContent>

            </React.Fragment>
          )}
          
        </Page>
      </PageInitializer>
    )
  }
}

SearchPage.propTypes = {
  // eslint-disable-next-line
  searchResult: PropTypes.shape({
    posts: PropTypes.arrayOf(PropTypes.shape({
      id:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })).isRequired,
    mentionedPlaces: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      ownerId: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
    })),
    relatedTags: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
  })
}

const consistentlyEmptyArray = [];

const mapStateToProps = (state) => {
  const { searchResult } = state;
  const searchResultPosts = searchResult && searchResult.posts ? searchResult.posts : consistentlyEmptyArray;
  const searchResultRelatedPlaces = searchResult && searchResult.mentionedPlaces ? searchResult.mentionedPlaces : consistentlyEmptyArray;
  const searchResultRelatedTags = searchResult && searchResult.relatedTags ? searchResult.relatedTags : consistentlyEmptyArray;
  const searchResultError = searchResult ? searchResult.error : undefined;
  return { searchResultError, searchResultPosts, searchResultRelatedPlaces, searchResultRelatedTags };
}

const matchDispatchToProps = dispatch => ({
  dispatchQuerySearch: (query) => dispatch(querySearch(query)),
  dispatchClearSearchResults: () => dispatch(clearSearchResults()),
  dispatchQueryRelatedPlaces: (postIds) => dispatch(queryRelatedPlaces(postIds)),
  dispatchFetchPlace: (placeId) => dispatch(placesActions.fetchPlace(placeId))
});

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(withRouter(SearchPage));
