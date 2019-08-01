import React from 'react';
import PropTypes from 'prop-types';
import {Elements, StripeProvider} from 'react-stripe-elements';

import configuration from '../../../configuration';
import CheckoutForm from '../PaymentForm';


class FinalizeOrderForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { stripe: null };
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({stripe: window.Stripe(configuration.INTEGRATIONS.STRIPE.PUBLIC_KEY)});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({stripe: window.Stripe(configuration.INTEGRATIONS.STRIPE.PUBLIC_KEY)});
      });
    }
  }

  render() {
    const { order } = this.props;
    return (
      <div className="store-front-checkout">
        <StripeProvider stripe={this.state.stripe}>
          <div className="finalize-order-form">
            <h2>Finalize Order</h2>
            <Elements>
              <CheckoutForm order={order} />
            </Elements>
          </div>
        </StripeProvider>        
      </div>

    );
  }
}

FinalizeOrderForm.propTypes = {
  order: PropTypes.shape({
    order_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    // items: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     sku: PropTypes.string,
    //     title: PropTypes.string,
    //     description: PropTypes.string,
    //     img: PropTypes.string
    //   })
    // )
  })
}


export default FinalizeOrderForm;