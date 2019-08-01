import React from 'react';
import configuration from '../../configuration';

// Inspired by: 
//    https://github.com/react-ga/react-ga/issues/122
//    https://www.analyticsmania.com/post/single-page-web-app-with-google-tag-manager/

export default (Component) =>
  class withGoogleAnalytics extends React.Component {
    componentDidMount() {
      const page = this.props.location.pathname;
      this.trackPage(page);
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;
      if (currentPage !== nextPage) this.trackPage(nextPage);
    }

    // Fall back - may not need
    trackPage = (page) => {
      if(configuration.CURRENT_DEPLOYMENT_ENVIRONMENT === configuration.DEPLOYMENT_ENVIRONMENTS.production) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
        'event': 'pageview',
        'url': page
        });
      }
    };

    render() {
      return (<Component {...this.props} />);
    }
  };