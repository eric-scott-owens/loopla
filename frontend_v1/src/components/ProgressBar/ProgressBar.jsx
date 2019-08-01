import React from 'react';
import PropTypes from 'prop-types';

import "./ProgressBar.scss";

const ProgressBar = ({ isDeterminate, percentage }) => (
  <div className="progress">
    {isDeterminate ? 
    <div className="determinate"
      style={{ width: `${percentage || 0}%` }} />
    : <div className="indeterminate" />
    }
  </div>
);

ProgressBar.propTypes = {
  isDeterminate: PropTypes.bool,
  percentage: PropTypes.number, // 0 to 100. Only applies when isDeterminate is true.
}

export default ProgressBar;