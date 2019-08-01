import React from 'react';
import PropTypes from 'prop-types';
import ReactGallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import DisplayPhoto from './DisplayPhoto';

import "./Gallery.scss";

class Gallery extends React.Component {
  constructor() {
    super();
    this.state = { 
      currentImage: 0 ,
      lightboxIsOpen: false,
    };
  }

  getRightSizing = () => {
    const { photos } = this.props;
    const numPhotos = photos.length;

    if (numPhotos === 1) {
      return 1;
    }
    if (numPhotos === 2 || numPhotos === 4) {
      return 2;
    }
    return 3;
  }

  gotoNext = () => {
    this.setState((prevState) => ({
      currentImage: prevState.currentImage + 1,
    }));
  }

  gotoPrevious = () => {
    this.setState((prevState) => ({
      currentImage: prevState.currentImage - 1,
    }));
  }

  openLightbox = (event, obj) => {
    this.swapThumbnailToImage();
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    });
  }

  closeLightbox = () => {
    this.swapImageToThumbnail();
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }

  swapThumbnailToImage() {
    const { photos, photoArray } = this.props;
    
    forEach(photos, (photo, index) => {
      if(photoArray[index].src === photo.thumbnailUrl) {
        photoArray[index].src = photo.imageUrl;
      }
    });
  }

  swapImageToThumbnail() {
    const { photos, photoArray } = this.props;

    forEach(photos, (photo, index) => {
      if(photoArray[index].src === photo.imageUrl) {
        photoArray[index].src = photo.thumbnailUrl;
      }
    });
  }

  render() {
    const { lightbox, photoArray } = this.props;
    const { currentImage, lightboxIsOpen } = this.state;

    return (
      <div className={`o-gallery ${this.props.className}`}>
        {
          lightbox ?
          <div>
          <ReactGallery photos={photoArray} ImageComponent={DisplayPhoto} columns={this.getRightSizing} onClick={this.openLightbox} margin={2} />
            <Lightbox images={photoArray}
              onClose={this.closeLightbox}
              onClickPrev={this.gotoPrevious}
              onClickNext={this.gotoNext}
              currentImage={currentImage}
              isOpen={lightboxIsOpen}
            />
          </div>
          : <ReactGallery photos={photoArray} ImageComponent={DisplayPhoto} columns={this.getRightSizing}/>
        }
      </div>
      )
  }
}

Gallery.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  })).isRequired,
  lightbox: PropTypes.bool,
}

const mapStateToProps = (state, props) => {
  const { photos } = props;
  const photoArray = [];
  
  forEach(photos, photo => {
    
      const formattedPhoto = {
        src: photo.thumbnailUrl,
        width: photo.width, 
        height: photo.height,
        caption: photo.caption,
      }
    
    photoArray.push(formattedPhoto);
  });

  return { photoArray };
}

export default connect(mapStateToProps)(Gallery);