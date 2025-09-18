import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { admin } from '../adminSl'
import { productApi } from '../product'


const Admin = admin as any

export const store = configureStore({
  reducer: {
    [Admin.reducerPath]: Admin.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware,Admin.middleware),
});

setupListeners(store.dispatch)
