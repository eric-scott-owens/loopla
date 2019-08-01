import React from "react";
import PropTypes from "prop-types";
import Close from '@material-ui/icons/Close';
import ExifOrientationImg from 'react-exif-orientation-img'

import IconButton from '../../../IconButton';
import TextField from '../../TextField';

import "./DraggablePhoto.scss";

const imgWithClick = { cursor: "pointer" };

class DraggablePhoto extends React.Component { 
  
  onUpdateCaption = (caption) => {
    if(this.props.photo.onUpdateCaption) {
      this.props.photo.onUpdateCaption(caption);
    }
  }

  onDelete = (event) => {
    if(this.props.photo.onDelete) {
      this.props.photo.onDelete(event);
    }
  }
  
  render() {
    const { index, onClick, photo, margin, direction, top, left } = this.props;
    const { isNewPhoto, validationMessages, isDirty, disabled, onDelete, onUpdateCaption, dataObject, caption, ...photoAttributes } = photo;
    
    const canDelete = !!onDelete;
    const canUpdateCaption = !!onUpdateCaption;

    const imgStyle = { margin };
    if (direction === "column") {
      imgStyle.position = "absolute";
      imgStyle.left = left;
      imgStyle.top = top;
    }

    return (
      <div className={`o-gallery-photo ${isNewPhoto ? 'o-new-photo' : 'o-existing-photo'}`}>
        <ExifOrientationImg
          style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
          {...photoAttributes}
          onClick={onClick ? this.handleClick : null}
          alt="img"
        />

        <span className="o-photo-details">
          {/* {(value.file.size/1000000).toFixed(2)} MB */}

          {!disabled && canUpdateCaption && (
            <TextField 
              placeholder="Caption"
              value={caption}
              onChange={(updatedCaption) => { this.onUpdateCaption(updatedCaption); } } 
              isDirty={isDirty}
              validationMessages={validationMessages.map(m => m.errorMessage)}
              />
          )}
        </span>

        {!disabled && canDelete && (
          // If in edit mode - show a delete button for each element
          
          <IconButton
            onClick={this.onDelete}
            shape="square"
            className="o-delete-photo">
              <Close />
          </IconButton>
        )}
      </div>
    );
  };
}
export default DraggablePhoto;