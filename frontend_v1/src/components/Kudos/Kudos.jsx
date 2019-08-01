import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as kudosActions from '../../containers/kudos/availableKudos/actions';


import "./Kudos.scss";

class Kudos extends React.Component {
  
  componentDidMount() {
    this.props.dispatchGetKudo(this.props.id);
  }

  onClick = () => {
    this.props.onSelect(this.props.id);
  }

  render() {
    const { kudo, quantity } = this.props;

    if (!kudo) {
      return "Loading..."
    }

    return(
      <div onClick={this.onClick}>
        <div key={kudo.id}>
          <img src={kudo.sticker} alt={kudo.title} height='100px' width='100px'/> 
          <div> {kudo.title} </div>
          <div> {kudo.description} </div>
          <div> Quantity: {quantity} </div>
        </div>
      </div>
    );
  }
}

Kudos.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  selected: PropTypes.bool
}

const mapStateToProps = (state, props) => {
  const kudo = state.kudos[props.id];
  const quantity = state.availableKudos[props.id];
  return { kudo, quantity };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchGetKudo: (kudoId) => dispatch(kudosActions.getFullKudo(kudoId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Kudos);