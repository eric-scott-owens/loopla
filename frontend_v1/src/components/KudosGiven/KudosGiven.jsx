import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Kudos from '../Kudos';
import UserAvatar from '../UserAvatar';
import UserDisplayName from '../UserDisplayName';

class KudosGiven extends React.Component {

  componentDidMount() {
    if(!this.props.kudosGiven) {
      this.props.dispatchFetchGivenKudos(this.props.id);
    }
  }

  render() {
    const { kudosGiven } = this.props;
    return (
      <div className="o-kudos-given">
        <Kudos id={kudosGiven.kudosId} />
        <div>
          <strong>Edition Number:</strong>
          <div>{kudosGiven.editionNumber}</div>
        </div>

        <div>
          From: 
          <UserAvatar id={kudosGiven.giverId} />
          <UserDisplayName id={kudosGiven.giverId} />
        </div>

        <div>
          <strong>Note:</strong>
          <div>
            {kudosGiven.note}
          </div>
        </div>
      </div>
    );
  }
}

KudosGiven.propTypes = {
  // Used in mapStateToProps
  // eslint-disable-next-line
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

const mapStateToProps = (state, props) => {
  const kudosGiven = state.kudosGiven[props.id];
  return { kudosGiven }
};

const mapDispatchToProps = (dispatch) => ({
  dispatchFetchGivenKudos: dispatch => { throw new Error('Not Implemented'); } // TODO
});

export default connect(mapStateToProps, mapDispatchToProps)(KudosGiven);