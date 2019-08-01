import React from 'react';
import Shop from '../../components/Shop';
import PageInitializer from '../PageInitializer';


const ShopPage = () => ( 
  <PageInitializer>
    <div className="store-front">
      <Shop/>
    </div>
  </PageInitializer>
);

export default ShopPage;
