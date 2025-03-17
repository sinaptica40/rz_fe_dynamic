import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { loginLayoutApi } from '../services/apiSlice';
import PageReducer from './pageSlice'
import DataReducer from './dataSlice'

export const store = configureStore({
  reducer: {
    [loginLayoutApi.reducerPath]: loginLayoutApi.reducer,
  //  [getApi.reducerPath]: getApi.reducer,
    page: PageReducer,
    data: DataReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(
      loginLayoutApi.middleware,
       //  getApi.middleware
         ),
});

setupListeners(store.dispatch);
