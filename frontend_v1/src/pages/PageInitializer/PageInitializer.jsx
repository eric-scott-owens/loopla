import React from 'react';
import PropTypes from 'prop-types';
import configuration from '../../configuration';
import * as styleUtilities from '../../utilities/StyleUtilities';

class PageInitializer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.pageClassName = undefined;

    const pageClassName = this.getPageClassName();
    styleUtilities.addBodyClass(pageClassName);

    if(!props.noScrollToTop) {
      styleUtilities.scrollToTopOfPage({ behavior: 'auto' });
    }
  }
    
  componentWillUnmount() {
    const pageClassName = this.getPageClassName();
    styleUtilities.removeBodyClass(pageClassName);
  }

  getPageClassName = () => {
    if(!this.pageClassName) {
      const pagePath = window.location.pathname.substring(configuration.APP_ROOT_URL.length);
      if( pagePath ==='/') {
        if(this.props.currentUser && this.props.currentUser.id) {
          // logged in
          this.pageClassName = 'o-page--home';
        } else {
          // Not logged in
          this.pageClassName = 'o-page--landing_page';
        }
      }
      else {
        const pagePathParts = pagePath.split('/');
        
        while(pagePathParts[pagePathParts.length -1] === '') {
          pagePathParts.pop();
        }
  
        this.pageClassName = `o-page${pagePathParts.join('--')}`;
      }
    }

    return this.pageClassName;
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}

PageInitializer.propTypes = {
  noScrollToTop: PropTypes.bool
}

export default PageInitializer;