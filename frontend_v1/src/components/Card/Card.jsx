import React from 'react';
import PropTypes from 'prop-types';

import './Card.scss';

const Card = (props) => (
    <div className={`o-card ${props.className}`}> 
        { props.children }
    </div>
)

Card.propTypes = {
  children: PropTypes.node
}

export default Card;