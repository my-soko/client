import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productReducer";
import authReducer from "./reducers/authReducer";
import reviewReducer from "./reducers/reviewSlice";
import paymentReducer from "./reducers/paymentSlice";
import favouriteReducer from "./reducers/favouriteSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    review: reviewReducer,
    payment: paymentReducer,
    favourites: favouriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
