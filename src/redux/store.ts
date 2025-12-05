import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productReducer";
import authReducer from "./reducers/authReducer";
import reviewReducer from "./reducers/reviewSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    review: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
