import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import { addToCartSuccess, updateAmountSuccess } from './actions';
import api from '../../../services/api';
import history from '../../../services/history';
import formatPrice from '../../../util/formatPrice';


function* addToCart({ id }){
  const productExists = yield select(
    state => state.cart.find(product => product.id === id)
  )

  const stock = yield call(api.get, `/stock/${id}`)

  const { amount: stockAmount } = stock.data;
  const currentAmount = productExists ? productExists.amount : 0;
  const amount = currentAmount + 1;

  if( amount > stockAmount ){
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  if(productExists){
    yield put(updateAmountSuccess(id, amount))
  } 
  else{
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price)
    };

    yield put(addToCartSuccess(data));
    history.push('/cart');
  }


}

function* updateAmount({ id, amount }){
  if(amount <= 0) return;

  const stock = yield call(api.get, `/stock/${id}`)
  const { amount: stockAmount } = stock.data;

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  yield put(updateAmountSuccess(id, amount));

}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
])