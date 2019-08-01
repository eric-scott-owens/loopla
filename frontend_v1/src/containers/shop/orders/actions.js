import { fetch } from '../../../actions/fetch';
import { HttpMethods, StandardHeaders } from '../../http';
import configuration from '../../../configuration';

export const createOrder = orderItems => async dispatch => {
  try {
    const json = JSON.stringify({ order_items: orderItems });
    const params = {
      method: HttpMethods.POST,
      body: json,
      headers: StandardHeaders.AJAX
    }
    
    const order = await dispatch(fetch(`${configuration.API_ROOT_URL}/shop/create-order/`, params));
    return order;
  } catch(error) {
    throw error;
  }
}

export const processOrder = (orderId, stripeToken) => async dispatch => {
  try {
    const json = JSON.stringify({ order_id: orderId, stripe_token: stripeToken });
    const params = {
      method: HttpMethods.POST,
      body: json,
      headers: StandardHeaders.AJAX
    }

    const order = await dispatch(fetch(`${configuration.API_ROOT_URL}/shop/process-order/`, params));
    return order;
  } catch(error) {
    throw error;
  }
}