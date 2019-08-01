import React from 'react';
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';

import configuration from '../../configuration';
import Gallery from '../Gallery'

class PhotoCollection extends React.Component {
  constructor(props) {
    super(props);
    this.photos = [];

    if(props && props.value && props.value.photoCollectionPhotos) {
      this.updatePhotos(props.value.photoCollectionPhotos);
    }
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.value.photoCollectionPhotos !== nextProps.value.photoCollectionPhotos) {
      this.updatePhotos(nextProps.value.photoCollectionPhotos);
    }

    return true;
  }

  updatePhotos = (photoCollectionPhotos) => {
    this.photos = [];
    
    const sortedPhotoCollectionPhotos = photoCollectionPhotos.slice(0);
    sortedPhotoCollectionPhotos.sort((a, b) => a.orderingIndex - b.orderingIndex);

    forEach(sortedPhotoCollectionPhotos, photoCollectionPhoto => {
      const { photo } = photoCollectionPhoto;

      this.photos.push({
        imageUrl: `${configuration.API_ROOT_URL}/components/photo-collections/images/${photo.id}/`,
        thumbnailUrl: `${configuration.API_ROOT_URL}/components/photo-collections/thumbnails/${photo.id}/`,
        height: photo.height,
        width: photo.width,
        caption: photo.caption
      })
    });
  }

  render() {
    const { lightbox } = this.props;

    return (
      <div className={this.props.parentClassName}>
        {
          lightbox ? 
          <Gallery className={this.props.galleryClassName} photos={this.photos} lightbox/> :
          <Gallery className={this.props.galleryClassName} photos={this.photos}/>
        }
      </div>
    );
  }
}

PhotoCollection.propTypes = {
  value: PropTypes.shape({
    photoCollectionPhotos: PropTypes.arrayOf(
      PropTypes.shape({
        orderingIndex: PropTypes.number,
        photo: PropTypes.shape({
          caption: PropTypes.string,
          id: PropTypes.number
        })
      })
    )
  }),
  lightbox: PropTypes.bool,
}

export default PhotoCollection;
