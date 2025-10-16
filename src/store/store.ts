import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './navigationSlice';
import walletModalReducer from './walletModalSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      walletModal: walletModalReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
