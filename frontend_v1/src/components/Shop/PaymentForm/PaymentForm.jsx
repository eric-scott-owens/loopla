import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {Elements, StripeProvider} from 'react-stripe-elements';

import configuration from '../../../configuration';
import Currency from '../../Currency';
import PaymentFormElements from './PaymentFormElements';


class PaymentForm extends React.Component {
  
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
    
    if(!order) return null;

    // Sort the items from most expensive to least
    const sortedItems = (get(this.props, 'order.items', [])).slice(0);
    sortedItems.sort((a,b) => b.amount - a.amount);    

    return (
      <div className="store-front-checkout">
        <StripeProvider stripe={this.state.stripe}>
          <div className="finalize-order-form">
            <h2>Finalize Order</h2>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* line items */}
                {sortedItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right"><Currency value={item.amount} /></td>
                  </tr>
                ))}

                {/* order summary */}
                <tr className="text-right">
                  <td colSpan={2}><strong>total:</strong></td>
                  <td><strong><Currency value={order.amount} /></strong></td>
                </tr>
              </tbody>
            </table>

            <Elements>
              <PaymentFormElements order={order} />
            </Elements>
          </div>
        </StripeProvider>        
      </div>

    );
  }
}

PaymentForm.propTypes = {
  order: PropTypes.shape({
    order_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number,
        currency: PropTypes.string,
        description: PropTypes.string,
        parent: PropTypes.string,
        quantity: PropTypes.number,
        itemType: PropTypes.string
      })
    )
  })
}


export default PaymentForm;