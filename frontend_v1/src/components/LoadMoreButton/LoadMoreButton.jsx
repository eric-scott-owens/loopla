import React from 'react';
import PropTypes from 'prop-types';
import BasicButton from '../BasicButton';

class LoadMoreButton extends React.Component {
  onClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    return (
      <BasicButton 
        onClick={this.onClick}
        color="secondary"
        className="w-100">{this.props.children ? this.props.children : 'Click to load more'}</BasicButton>
    );
  }
}

LoadMoreButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

export default LoadMoreButton;