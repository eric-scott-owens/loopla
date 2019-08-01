import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CatalogItem from '../CatalogItem/CatalogItem'; 
import * as catalogActions from '../../containers/catalogItems/actions';
import { createOrder } from '../../containers/shop/orders/actions';
import PaymentForm from './PaymentForm';
import BasicButton from '../BasicButton';

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
      isModalVisible: false
    }
  }
  
  componentDidMount() {
    this.props.dispatchGetCatalogItems();
  }

  createOrder = async (sku) => {
    const order = await this.props.dispatchCreateOrder([{ parent: sku, quantity: 1}]);
    this.setState({ order });
    this.setState({isModalVisible: true});
  }

  toggleModal = () => {
    this.setState(prevState => ({
      isModalVisible: !prevState.isModalVisible
    }));
  }

  render() { 
    const { catalogItems } = this.props;
    if (Object.entries(catalogItems).length === 0) {
      return( null );
    }

    return (
      <div className="shop">

        <Container>
          <Row>
          {
            catalogItems && Object.keys(catalogItems).map(catalogItem => (
              <Col md="3" sm="6" key={catalogItem} >
                <CatalogItem id={catalogItem} onPurchase={this.createOrder}/>
              </Col>
            ))
          }
          </Row>
        </Container>
        <Modal isOpen={this.state.isModalVisible} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Delete</ModalHeader>
          <ModalBody className="text-center">
            <PaymentForm order={this.state.order} />
          </ModalBody>
        </Modal>
      </div>
    );
  } 
}

const mapStateToProps = (state) => {
  const { catalogItems } = state;
  return { catalogItems };
};

const mapDispatchToProps = dispatch => ({
  dispatchGetCatalogItems: () => dispatch(catalogActions.fetchCatalogItems()),
  dispatchCreateOrder: (orderItems) => dispatch(createOrder(orderItems))
});

export default connect(mapStateToProps, mapDispatchToProps)(Shop);