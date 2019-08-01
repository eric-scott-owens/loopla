import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions/photos';
import TextFinder from '../TextFinder';

import "./Photo.scss";

class Photo extends React.Component {
  componentDidMount() {
    if(!this.props.photo) {
      this.props.dispatchFetchPhoto(this.props.id);
    }
  }

  render() {
    const { photo, hideCaption } = this.props;
    return !photo ? null : (
      <div className="o-photo-container">
        <img className="o-photo" src={photo.url} alt={photo.caption} />
        { 
          (!hideCaption) && 
          <div className="o-photo-caption"><TextFinder>{photo.caption}</TextFinder></div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const photo = state.photos[props.id];
  return { photo };
};

const mapDispatchToProps = dispatch => ({
  dispatchFetchPhoto: id => dispatch(actions.fetchPhoto(id))
});

Photo.propTypes = {
  // eslint-disable-next-line
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hideCaption: PropTypes.bool
}

export default connect(mapStateToProps, mapDispatchToProps)(Photo);