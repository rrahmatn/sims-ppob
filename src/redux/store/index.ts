// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducer/user'; 
import paymentReducer from '../reducer/payment';

const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
