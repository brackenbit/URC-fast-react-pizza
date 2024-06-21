/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    },
});

export default store;
