import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import sortBy from 'lodash/sortBy';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';

import Place from '../Place';
import configuration from '../../configuration';
import { batchFetchPlaces } from '../../containers/places/actions';
import { batchFetchUsers } from '../../containers/users/actions'
import UserDisplayName from '../UserDisplayName';

import './MentionedPlaces.scss';

function batchLoadDataFor(mentionedPlaces, dispatchBatchFetchPlaces, dispatchBatchFetchUsers) {
  const placeIds = mentionedPlaces.map(mp => mp.id);
  
  const userIdHash = {};
  forEach(mentionedPlaces, mention => {
    forEach(mention.ownerIds, ownerId => {
      userIdHash[ownerId] = true;
    });
  });
  
  const userIds = keys(userIdHash);
  dispatchBatchFetchPlaces(placeIds);
  dispatchBatchFetchUsers(userIds);
}

class MentionedPlaces extends React.Component {

  componentDidMount() {
    const { mentionedPlaces } = this.props;
    if(mentionedPlaces && mentionedPlaces.length > 0) {
      batchLoadDataFor(mentionedPlaces, this.props.dispatchBatchFetchPlaces, this.props.dispatchBatchFetchUsers);
    }
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.mentionedPlaces !== nextProps.mentionedPlaces && nextProps.mentionedPlaces.length > 0) {
      batchLoadDataFor(nextProps.mentionedPlaces, this.props.dispatchBatchFetchPlaces, this.props.dispatchBatchFetchUsers);
    }

    return true;
  }

  render() {
    const { sortedMentionedPlaces } = this.props;
    return (
      <Row className="o-mentioned-places">
        {sortedMentionedPlaces.map(p => 
          <Col sm="6" className="o-mentioned-place" key={`${p.id}|${p.ownerIds.join(',')}`}>
            <Place id={p.id} noMap />
            <div className="o-place-attribution">
              Mentioned by {' '}
              { p.ownerIds.map((ownerId, index) => (
                <React.Fragment key={`{p.id}|${p.ownerIds.join(',')}|${ownerId}`}>
                  <UserDisplayName id={ownerId} />
                  { (index < (p.ownerIds.length - 1)) && ', '}
                </React.Fragment>
              )) }
            </div>
          </Col>
        )}
      </Row>
    )
  }
} 

MentionedPlaces.propTypes = {
  // eslint-disable-next-line
  mentionedPlaces: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ownerIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
  }))
}

const consistentlyEmptyArray = [];

const mapStateToProps = (state, props) => {
  const things = [];
  let isDataLoadComplete = true;
  let sortedMentionedPlaces = [];

  // Flatten out the places and google places so that we can sort them by name
  forEach(props.mentionedPlaces || [], mentionedPlace => {
    // Try to load up the places
    const place = state.places[mentionedPlace.id];
    if(!place) {
      isDataLoadComplete = false;
      return false; // stop the loop... not ready yet
    }

    if(place.isUserGenerated) {
      things.push({
        id: place.id, 
        model: configuration.MODEL_TYPES.place,
        ownerIds: mentionedPlace.ownerIds,
        object: place
      });
    }
    else {
      const googlePlace = state.googlePlaces[place.googlePlaceId];
      if(!googlePlace) {
        isDataLoadComplete = false;
        return false; // stop the loop... not ready yet
      } 

      things.push({
        id: place.id,
        model: configuration.MODEL_TYPES.googlePlace,
        ownerIds: mentionedPlace.ownerIds,
        object: googlePlace
      });
    }

    return true; // don't stop the loop ;P
  });

  // Sort the places and google places by name... if the data is ready
  // If not, the ternary operator make this an nearly a no-op
  const sortedThings = sortBy(things, placeOrGooglePlace => placeOrGooglePlace.object.name);

  // Now that everything is sorted, return the place ids and owner ids
  // as a array ordered by our sort
  sortedMentionedPlaces = sortedThings.map(thing => ({ 
    id: thing.id, 
    ownerIds: thing.ownerIds
  }));

  // If the data wasn't loaded, send back consistentlyEmptyArray
  // so that react doesn't detect a reason to redraw
  return { sortedMentionedPlaces: (isDataLoadComplete ? sortedMentionedPlaces : consistentlyEmptyArray) };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchBatchFetchPlaces: (placeIds) => dispatch(batchFetchPlaces(placeIds)),
  dispatchBatchFetchUsers: (userIds) => dispatch(batchFetchUsers(userIds))
});

export default connect(mapStateToProps, mapDispatchToProps)(MentionedPlaces);