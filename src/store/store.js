import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
// import { getApi } from "../services/appServices";
//import { devApi } from '../services/Query/dev';
import { loginLayoutApi } from '../services/apiSlice';



export const store = configureStore({
  reducer: {
    [loginLayoutApi.reducerPath]: loginLayoutApi.reducer,
  //  [getApi.reducerPath]: getApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(
      loginLayoutApi.middleware,
       //  getApi.middleware
         ),
});

setupListeners(store.dispatch);
