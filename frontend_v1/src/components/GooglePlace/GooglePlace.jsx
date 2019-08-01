import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import configuration from '../../configuration';
import * as actions from '../../containers/places/googlePlaces/actions';
import GooglePlaceMap from '../GooglePlaceMap';

import '../Place/Place.scss';
import './GooglePlace.scss';

class GooglePlace extends React.Component {

  componentDidMount () {
    if(this.props.id) {
      this.props.dispatchFetchGooglePlace(this.props.id);
    }
  }

  render() {
    const { 
      googlePlace,
      parentPlaceId,
      renderPlaceLabel,
      noLink,
      noLinkHeader,
      noHeader,
      noMap,
      noAddress,
      noPhone,
      noWebsite } = this.props;
    
    if(!googlePlace) return null;

    return (
      <div className="o-google-place o-place">

        {/* heading */}
        { !noHeader && (
          <div className="o-place-listing-heading">
            
            {(noLink || noLinkHeader) ? renderPlaceLabel(googlePlace) : (
              <Link to={`${configuration.APP_SEARCH_URL}?p=${parentPlaceId}`}>
                { renderPlaceLabel(googlePlace) }
              </Link>
            )}
            
          </div>
        )}

        {/* Map */}
        { !noMap && googlePlace.geometry && googlePlace.geometry.location && (
          <GooglePlaceMap id={googlePlace.id} />
        )}

        {/* Address */}
        { !noAddress && 
          (noLink ? 
            (
              <div className="o-google-place-address">{googlePlace.formattedAddress}</div>
            ) : (
              <div className="o-google-place-address">
                <a
                  href={`https://maps.google.com/?q=${googlePlace.formattedAddress}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="o-link-underline">
                  {googlePlace.formattedAddress}
                </a>
              </div>
            )
          )
        }

        {/* Phone Number */}
        { !noPhone && 
          (noLink ? 
            (
              <div className="o-google-place-phone">{googlePlace.formattedPhoneNumber}</div>
            ) : (
              <div className="o-google-place-phone">
                <a 
                href={`tel:${googlePlace.formattedPhoneNumber}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="o-link-underline">
                {googlePlace.formattedPhoneNumber}
                </a>
              </div>
            )
          )
        }

        {/* Website */}
        { !noWebsite && 
          (noLink ? 
            (
              <div className="o-google-place-website">{googlePlace.website}</div>
            ) : (
              <div className="o-google-place-website">
                <a 
                  href={googlePlace.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="o-link-underline">
                  {googlePlace.website}
                </a>
              </div>
            )
          )
        }
      </div>
    )
  }
}

GooglePlace.propTypes = {
  // eslint-disable-next-line
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parentPlaceId: (props, propName, componentName, location) => {
    if(!props.parentPlaceId && !props.noLink) {
      return new Error(`One of props '${propName}' or 'noLink' was not specified in ${componentName}.`);
    }
    
    const typeOfValue = typeof props.parentPlaceId;
    if(props.parentPlaceId && typeOfValue !== 'string' && typeOfValue !== 'number') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'string'.`);
    }

    return undefined;
  },
  renderPlaceLabel: PropTypes.func,
  noLink: PropTypes.bool, 
  noLinkHeader: PropTypes.bool,
  noHeader: PropTypes.bool,
  noMap: PropTypes.bool,
  noAddress: PropTypes.bool,
  noPhone: PropTypes.bool,
  noWebsite: PropTypes.bool
}

const mapStateToProps = (state, props) => {
  const googlePlace = state.googlePlaces[props.id];
  return { googlePlace };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchGooglePlace: (id) => dispatch(actions.fetchGooglePlace(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(GooglePlace);