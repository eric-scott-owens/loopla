import React from "react";
import './DisplayPhoto.scss';

const DisplayPhoto = ({ photo, onClick, index, margin }) => {
    const { caption } = photo;
    const imgWithClick = { cursor: "pointer" };

    return (

      <div className='o-gallery-photo' style={{margin}}>
        { 
          onClick ? 
          <button 
            className='o-gallery-photo-button'
            type="button"
            onClick={e => onClick(e, { index, photo })}
            onKeyPress={e => onClick(e, { index, photo })}
            tabIndex="0"
            >

            <img
              style={imgWithClick}
              {...photo}
              alt={caption}
              />
          </button > 
          :
          <img
          {...photo}          
          alt={caption}
          />

        }
        

      </div>
    );
  };

export default DisplayPhoto;
