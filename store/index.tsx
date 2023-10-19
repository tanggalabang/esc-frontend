import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import { apiSlice } from '@/redux/features/api/apiSlice';

// Buat reducer baru dengan menggabungkan reducer-reducer dari kedua store
const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
