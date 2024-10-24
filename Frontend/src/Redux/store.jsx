import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Redux/authSlice';
import imageReducer from '../Redux/imageSlice';


export const store = configureStore({
    reducer: {
      auth: authReducer,
      images : imageReducer,
    },
  });

  