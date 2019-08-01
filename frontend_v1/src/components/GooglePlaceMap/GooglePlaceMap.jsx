import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import configuration from '../../configuration';
import * as actions from '../../containers/places/googlePlaces/actions';

import './GooglePlaceMap.scss';

class GooglePlaceMap extends React.Component {

  componentDidMount () {
    if(this.props.id) {
      this.props.dispatchFetchGooglePlace(this.props.id);
    }
  }

  render() {
    const { googlePlace } = this.props;
    if(!googlePlace) return null;

    return (
      <GoogleMap
        defaultZoom={configuration.google.DEFAULT_MAP_ZOOM}
        defaultCenter={googlePlace.geometry.location}
      >
        <Marker position={googlePlace.geometry.location} />
      </GoogleMap>
    );
  }
}


GooglePlaceMap.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state, props) => {
  const googlePlace = state.googlePlaces[props.id];
  return { googlePlace };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchGooglePlace: (id) => dispatch(actions.fetchGooglePlace(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(
  compose(
    withProps({
      loadingElement: <div className="o-google-place-map-loading" />,
      containerElement: <div className="o-google-place-map-container" />,
      mapElement: <div className="o-google-place-map" />,
    }),
    withGoogleMap
)(GooglePlaceMap));