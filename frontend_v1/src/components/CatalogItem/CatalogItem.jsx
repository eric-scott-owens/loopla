import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as catalogActions from '../../containers/catalogItems/actions';
import { createOrder } from '../../containers/shop/orders/actions';
import Card from '../Card';
import BasicButton from '../BasicButton';
import Currency from '../Currency';

class CatalogItem extends React.Component {
  componentDidMount() {
    const { id } = this.props;
    this.props.dispatchGetCatalogItem(id);
  }

  purchase = () => {
    const { catalogItem } = this.props;
    this.props.onPurchase(catalogItem.sku);
  }

  render() { 
    const { catalogItem } = this.props;

    return (
      <Card>
        <div> {catalogItem.sku} </div>
          {
          catalogItem.kudos.map(kudo => 
          <div key={kudo.id}>
            <div> {kudo.title} </div>
            <img src={kudo.sticker} alt={kudo.title} height='100px' width='100px'/> 
            <div> {kudo.description} </div>
            <div> {kudo.artist} </div>
          </div>
          )
        }
        <div><Currency value={catalogItem.price} /></div>
        <BasicButton onClick={this.purchase} color='primary'> Buy </BasicButton>
      </Card>
      
    );
  } 
}

const mapStateToProps = (state, props) => {
  let catalogItem = {};

  if (state.catalogItems[props.id]) {
    catalogItem = state.catalogItems[props.id]; 
  }

  return { catalogItem };
};

CatalogItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPurchase: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  dispatchGetCatalogItem: (id) => dispatch(catalogActions.fetchCatalogItem(id)),
  dispatchCreateOrder: (orderItems) => dispatch(createOrder(orderItems))
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogItem);