import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import { FormattedDate, FormattedRelative } from 'react-intl';

import "./DateFormatter.scss";

const DateFormatter = (props) => {
  if (!(props.date)) return (<span className="o-date" />); 

  const displayDate = moment(props.date);
  if(props.isTimeElapsed) {
    const now = moment();
    
    const diffMinutes = now.diff(displayDate, 'minutes');
    const diffHours = now.diff(displayDate, 'hours');
    const diffDays = now.diff(displayDate, 'days');
    const diffWeeks = now.diff(displayDate, 'weeks');

    if (diffHours < 1) { 
      // return (<FormattedRelative value={displayDate} unit="minute"/>);
      // If less than one hour show only minutes MM'm'
      return (<span className="o-date">{diffMinutes}m</span>); 
    }
    
    if (diffDays < 1) { 
      // return (<FormattedRelative value={displayDate} unit="hour"/>);
      // Else if less than one day show only hours HH'h'
      return (<span className="o-date">{diffHours}h</span>); 
    }
    
    if (diffWeeks < 1) { 
      // return (<FormattedRelative value={displayDate} unit="day"/>);
      // Else if less than a week show only days DD'd'
      return (<span className="o-date">{diffDays}d</span>); 
    }
    
    if(displayDate.year() === now.year()) {
      return(<span className="o-date">{displayDate.format("MMM D")}</span>);
    }

    // return (<FormattedDate value={displayDate}></FormattedDate>);
    return (<span className="o-date">{displayDate.format("MMM D, YYYY")}</span>);
  }

    return <span className="o-date">{displayDate.format("MMMM D, YYYY")}</span>;
}

DateFormatter.propTypes = {
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  isTimeElapsed: PropTypes.bool
}

export default DateFormatter;