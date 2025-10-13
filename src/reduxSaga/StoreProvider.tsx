
import React, {useEffect} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import App from '../../App';
import configureStore from './configureStore';

const initialState = {};
export const store = configureStore(initialState);


const StoreProvider = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default StoreProvider;
