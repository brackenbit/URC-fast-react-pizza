/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action) {
            // Mutable state means you can simply push!
            // One benefit of modern Redux.
            state.cart.push(action.payload);
        },
        deleteItem(state, action) {
            state.cart = state.cart.filter(
                (item) => item.pizzaId !== action.payload,
            );
        },
        increaseItemQuantity(state, action) {
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
        },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload,
            );
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice;
            // If decrement has removed last item, also call deleteItem
            if (item.quantity === 0) {
                cartSlice.caseReducers.deleteItem(state, action);
            }
        },
        clearCart(state) {
            state.cart = [];
        },
    },
});

export const {
    addItem,
    deleteItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Redux recommends data manipulation directly in selector function,
// with the relevant functions stored in the slice file.
// Having them here may cause performance issues in large applications
// - look into "reselect" library for memoised selectors if this is an issue.
export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
    state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCurrentQuantityById = (id) => (state) =>
    state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
/*
    ^ Nested arrow function, read as: getCurrentQuantityById is a function taking id as an argument
    (required to pass id where this func is used, e.g. MenuItem), which returns a function taking state as an argument
    (required for this to return a valid selector function).
    Both id and state can then be used in the closure.
    Equivalent to:
    export function getCurrentQuantityById(id) {
        return function (state) {
            return state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
        }
    }
*/
