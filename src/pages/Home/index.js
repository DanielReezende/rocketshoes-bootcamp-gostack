import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md'

import api from '../../services/api';
import { ProductList } from './styles';
import formatPrice from '../../util/formatPrice';

function Home(props) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts(){
      const response = await api.get('products');

      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price)
      }))

      setProducts(data);
    }

    loadProducts()
  }, [])

  const handleAddProduct = product => {
    const { dispatch } = props;

    dispatch({
      type: 'ADD_TO_CART',
      product,
    })
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img
            src={product.image}
            alt={product.title}
          />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>

          <button type="button" onClick={() => handleAddProduct(product)}>
            <div>
              <MdAddShoppingCart size={16} color="#fff" /> 3
            </div>
            <span>Adicionar ao Carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}

export default connect()(Home);