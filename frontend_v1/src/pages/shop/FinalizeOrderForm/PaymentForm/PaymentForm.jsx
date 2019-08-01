import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CardElement, injectStripe } from 'react-stripe-elements';

import { processOrder } from '../../../containers/shop/orders/actions';
import BasicButton from '../../BasicButton'

class PaymentForm extends React.Component {
  handleSubmit = async (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    const { currentUser, order } = this.props;
    const result = await this.props.stripe.createToken({type: 'card', name: `${currentUser.firstName} ${currentUser.lastName}`});
    const { token, error } = result;
    
    if(token) {
      this.props.dispatchProcessOrder(order.orderId, token.id);
    }

    if(error) {
      console.error(error);
    }
  };

  render() {
    const { order } = this.props;
    if (!order) return null;

    return (
      <div className="checkout">
        <CardElement />
        <BasicButton onClick={this.handleSubmit}>buy now</BasicButton>
      </div>
    )
  }

}

PaymentForm.propTypes = {
  order: PropTypes.shape({
    order_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
}

const mapStateToProps = (state) => {
  const currentUser = state.users[state.currentUserId]
  return { currentUser };
}


const mapDispatchToProps = (dispatch) => ({
  dispatchProcessOrder: (orderId, stripeToken) => dispatch(processOrder(orderId, stripeToken))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectStripe(PaymentForm));