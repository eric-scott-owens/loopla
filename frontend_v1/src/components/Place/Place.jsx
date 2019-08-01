import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import configuration from '../../configuration';
import { newKeyFor } from '../../utilities/ObjectUtilities';
import * as placesActions from '../../containers/places/actions';
import GooglePlace from '../GooglePlace';
import TextFinder from '../TextFinder';

import './Place.scss';

class Place extends React.Component {

  componentDidMount () {
    if(
      !this.props.place &&
      this.props.id !== newKeyFor(configuration.MODEL_TYPES.place)
    ) {
      this.props.dispatchFetchPlace(this.props.id);
    }
  }

  onDelete = () => {
    const { onDelete, place } = this.props;
    if(onDelete) {
      onDelete(place);
    }
  }

  renderPlaceLabel = place => {
    const { onDelete } = this.props;
    return (
      <div className="o-place-wrapper">
        <div className="o-place-label">
          <TextFinder>{place.name}</TextFinder>
          {onDelete && <button 
                        type="button" 
                        className="o-delete-place-button link" 
                        onClick={this.onDelete}>✕</button>}
        </div>
      </div>
    )
  }

  render() {
    const { 
      place,
      noLinkHeader,
      noLink, 
      noHeader,
      noMap,
      noAddress,
      noPhone,
      noWebsite 
    } = this.props;

    if(!place) return null;

    return(
      <div className="o-place">  
        {place.isUserGenerated ? 
          (
            <div className="o-place-listing-heading">
              
              {(noLink || noLinkHeader) ? (
                  this.renderPlaceLabel(place)
                ) : (
                  <Link 
                    to={`${configuration.APP_SEARCH_URL}?p=${place.id}`}>
                    {this.renderPlaceLabel(place)}
                  </Link>
                )}
            </div>
          ) :
          (
            <GooglePlace 
              id={place.googlePlaceId}
              parentPlaceId={place.id}
              renderPlaceLabel={this.renderPlaceLabel}
              noLink={noLink} 
              noLinkHeader={noLinkHeader}
              noHeader={noHeader}
              noMap={noMap}
              noAddress={noAddress}
              noPhone={noPhone}
              noWebsite={noWebsite} />
          )}
      </div>
    );
    
  }
}

Place.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onDelete: PropTypes.func,
  place: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isUserGenerated: PropTypes.bool.isRequired,
    name: PropTypes.string,
    googlePlaceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  noLink: PropTypes.bool,
  noLinkHeader: PropTypes.bool,
  noHeader: PropTypes.bool,
  noMap: PropTypes.bool,
  noAddress: PropTypes.bool,
  noPhone: PropTypes.bool,
  noWebsite: PropTypes.bool
}

const mapStateToProps = (state, props) => {
  let { place } = props;
  if(!place) {
    if(props.id) place = state.places[props.id];
    else throw new Error("CRITICAL: Cannot load place. An id must be provided");
  }

  return { place };
}

const mapDispatchToProps = dispatch => ({
  dispatchFetchPlace: (placeId) => dispatch(placesActions.fetchPlace(placeId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Place);