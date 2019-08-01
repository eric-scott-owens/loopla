import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import orderBy from 'lodash/orderBy';

import Place from '../Place';
import { batchFetchPlaces } from '../../containers/places/actions';

class PlaceList extends React.Component {

  componentDidMount() {
    if(this.props.placeIds && this.props.placeIds.length > 0) {
      this.props.dispatchBatchFetchPlaces(this.props.placeIds);
    }
  }

  shouldComponentUpdate(nextProps) {
    if(
      this.props.placeIds !== nextProps.placeIds 
      && nextProps.placeIds
      && nextProps.placeIds.length > 0
    ) {
      this.props.dispatchBatchFetchPlaces(nextProps.placeIds);
    }

    return true;
  }

  render() {
    const {placeIds} = this.props;
    if(!placeIds) return null;
    
    return (
      <div className="o-tag-list">
        <React.Fragment>
          {placeIds.map(p => (<Place key={p.id} id={p.id} />))}
        </React.Fragment>
      </div>
    )
  }
} 

PlaceList.propTypes = {
  placeIds: PropTypes.arrayOf(PropTypes.string)
}

const mapStateToProps = (state, props) => {
  const placeIds = (props.placeIds || []).slice(0);
  
  return { placeIds };
  
}

const mapDispatchToProps = (dispatch) => ({
  dispatchBatchFetchPlaces: (placeIds) => dispatch(batchFetchPlaces(placeIds))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaceList);