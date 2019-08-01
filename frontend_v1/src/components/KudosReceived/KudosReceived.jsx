import React from 'react';
import PropTypes from 'prop-types';
import KudosGiven from '../KudosGiven';


const KudosReceived = (props) => {
  const thing = props.for;
  const { kudosReceived } = thing;
  
  return (
    <div className="o-kudos-received">
      {kudosReceived && kudosReceived.map(id => (
        <KudosGiven id={id} key={id} />
      ))}
    </div>
  );
};

KudosReceived.propTypes = {
  for: PropTypes.shape({
    kudosReceived: PropTypes.arrayOf(PropTypes.string).isRequired
  })
};

export default KudosReceived;